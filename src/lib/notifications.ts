import { ParcelItem, ParcelStatus } from '../types';

export type BrowserNotificationPermission = NotificationPermission | 'unsupported';

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): BrowserNotificationPermission {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function isAlertTargetStatus(status: ParcelStatus): 'out_for_delivery' | 'delivered' | null {
  if (status === 'out_for_delivery') {
    return 'out_for_delivery';
  }
  if (status === 'delivered' || status === 'shipped') {
    return 'delivered';
  }
  return null;
}

export function buildParcelNotificationCopy(
  parcel: ParcelItem,
  target: 'out_for_delivery' | 'delivered'
): { title: string; body: string } {
  if (target === 'out_for_delivery') {
    return {
      title: `Parcel Out for Delivery: ${parcel.id}`,
      body: `Your shipment to ${parcel.receiverName} (${parcel.toCity}) is out for delivery in vehicle MH21 V 6370.`,
    };
  }
  return {
    title: `Parcel Delivered: ${parcel.id}`,
    body: `Your shipment to ${parcel.receiverName} (${parcel.toCity}) has been delivered safely.`,
  };
}

export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isBrowserNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }
  try {
    const notification = new Notification(title, {
      badge: '/favicon.ico',
      icon: '/favicon.ico',
      ...options,
    });
    notification.onclick = () => {
      if (typeof window !== 'undefined') {
        window.focus();
      }
      notification.close();
    };
    return notification;
  } catch (err) {
    console.warn('Browser notification dispatch notice:', err);
    return null;
  }
}
