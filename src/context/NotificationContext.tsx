import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ParcelStatus } from '../types';
import { useAuthParcel } from './AuthParcelContext';
import { useToast } from '../hooks/useToast';
import {
  BrowserNotificationPermission,
  isBrowserNotificationSupported,
  getNotificationPermission,
  isAlertTargetStatus,
  buildParcelNotificationCopy,
  sendBrowserNotification,
} from '../lib/notifications';

const STORAGE_KEY = 'jc_parcel_alerts_enabled';

interface NotificationContextType {
  isSupported: boolean;
  permission: BrowserNotificationPermission;
  alertsEnabled: boolean;
  requestPermission: () => Promise<BrowserNotificationPermission>;
  toggleAlerts: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userParcels, parcelsLoaded } = useAuthParcel();
  const toast = useToast();

  const [isSupported] = useState<boolean>(() => isBrowserNotificationSupported());
  const [permission, setPermission] = useState<BrowserNotificationPermission>(() =>
    getNotificationPermission()
  );
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignore storage access restrictions
    }
    return true;
  });

  // Track last known status per parcel so initial Firestore hydration never triggers stale alerts
  const prevStatusMapRef = useRef<Map<string, ParcelStatus>>(new Map());
  const seededInitialSnapshotRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);
  const alertedTransitionsRef = useRef<Set<string>>(new Set());

  // Sync browser permission on window focus (in case user updated browser site settings)
  useEffect(() => {
    if (!isSupported) return;
    const syncPermission = () => {
      setPermission(getNotificationPermission());
    };
    window.addEventListener('focus', syncPermission);
    return () => window.removeEventListener('focus', syncPermission);
  }, [isSupported]);

  // Reset status tracking whenever signed-in user changes
  useEffect(() => {
    const uid = currentUser?.id || null;
    if (lastUserIdRef.current !== uid) {
      lastUserIdRef.current = uid;
      prevStatusMapRef.current.clear();
      alertedTransitionsRef.current.clear();
      seededInitialSnapshotRef.current = false;
    }
  }, [currentUser?.id]);

  // Monitor real-time parcel status changes for 'Out for Delivery' and 'Delivered'
  useEffect(() => {
    if (!currentUser || !parcelsLoaded) {
      return;
    }

    if (!seededInitialSnapshotRef.current) {
      userParcels.forEach((parcel) => {
        prevStatusMapRef.current.set(parcel.id, parcel.status);
      });
      seededInitialSnapshotRef.current = true;
      return;
    }

    const nextMap = new Map<string, ParcelStatus>();

    userParcels.forEach((parcel) => {
      const previousStatus = prevStatusMapRef.current.get(parcel.id);
      nextMap.set(parcel.id, parcel.status);

      const hasChanged = previousStatus !== undefined && previousStatus !== parcel.status;
      if (!hasChanged) return;

      const target = isAlertTargetStatus(parcel.status);
      if (!target) return;

      const dedupeKey = `${parcel.id}:${parcel.status}`;
      if (alertedTransitionsRef.current.has(dedupeKey)) return;
      alertedTransitionsRef.current.add(dedupeKey);

      const copy = buildParcelNotificationCopy(parcel, target);

      // Fire native browser Notification if granted and enabled
      if (alertsEnabled && getNotificationPermission() === 'granted') {
        sendBrowserNotification(copy.title, {
          body: copy.body,
          tag: `jc-${parcel.id}-${target}`,
        });
      }

      // Always mirror with in-app toast alert
      toast.success(copy.body, {
        title: copy.title,
        duration: 6500,
        meta: {
          trackingId: parcel.id,
          route: `${parcel.fromCity} to ${parcel.toCity}`,
        },
      });
    });

    prevStatusMapRef.current = nextMap;
  }, [currentUser, parcelsLoaded, userParcels, alertsEnabled, toast]);

  const persistEnabled = useCallback((next: boolean) => {
    setAlertsEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<BrowserNotificationPermission> => {
    if (!isBrowserNotificationSupported()) {
      toast.warning('Your current browser does not support desktop or push notifications.', {
        title: 'Notifications Unsupported',
      });
      return 'unsupported';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        persistEnabled(true);
        sendBrowserNotification('Joshi Couriers Alerts Enabled', {
          body: 'You will be alerted here when your parcel is Out for Delivery or Delivered.',
          tag: 'jc-alerts-enabled',
        });
        toast.success('Browser alerts enabled for Out for Delivery and Delivered updates.', {
          title: 'Delivery Alerts Active',
          duration: 4000,
        });
      } else if (result === 'denied') {
        persistEnabled(false);
        toast.warning('Notifications are blocked in your browser site settings. Enable them in site permissions to receive desktop alerts.', {
          title: 'Permission Blocked',
          duration: 5000,
        });
      } else {
        toast.info('Notification permission prompt was dismissed.', {
          title: 'Permission Pending',
        });
      }
      return result;
    } catch (err) {
      console.warn('Notification permission request failed:', err);
      toast.error('Could not request browser notification permission.');
      return getNotificationPermission();
    }
  }, [persistEnabled, toast]);

  const toggleAlerts = useCallback(async () => {
    const currentPerm = getNotificationPermission();
    if (currentPerm === 'unsupported') {
      toast.warning('Browser notifications are not supported on this device.', {
        title: 'Notifications Unsupported',
      });
      return;
    }

    if (currentPerm === 'default') {
      await requestPermission();
      return;
    }

    if (currentPerm === 'denied') {
      toast.warning('Notifications are blocked by your browser. Allow notifications for this site in your browser address bar settings.', {
        title: 'Browser Permission Blocked',
        duration: 5500,
      });
      return;
    }

    const nextEnabled = !alertsEnabled;
    persistEnabled(nextEnabled);
    if (nextEnabled) {
      sendBrowserNotification('Joshi Couriers Alerts Resumed', {
        body: 'You will receive alerts when parcels change to Out for Delivery or Delivered.',
        tag: 'jc-alerts-resumed',
      });
      toast.success('Browser delivery notifications turned on.', {
        title: 'Delivery Alerts On',
        duration: 3000,
      });
    } else {
      toast.info('Browser delivery notifications paused. In-app status updates remain active.', {
        title: 'Delivery Alerts Paused',
        duration: 3000,
      });
    }
  }, [alertsEnabled, persistEnabled, requestPermission, toast]);

  return (
    <NotificationContext.Provider
      value={{
        isSupported,
        permission,
        alertsEnabled,
        requestPermission,
        toggleAlerts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useParcelNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useParcelNotifications must be used within a NotificationProvider');
  }
  return context;
};
