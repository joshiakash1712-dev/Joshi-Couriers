import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ToastItem, ToastOptions, ToastType } from '../types';
import { ToastContainer } from '../components/ui/ToastContainer';

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 4;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions): string => {
      const id = options?.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type: options?.type || 'info',
        title: options?.title,
        message,
        duration: options?.duration !== undefined ? options.duration : 5000,
        action: options?.action,
        meta: options?.meta,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Remove if duplicate ID exists
        const filtered = prev.filter((t) => t.id !== id);
        // Keep within MAX_TOASTS limit
        const updated = [...filtered, newToast];
        if (updated.length > MAX_TOASTS) {
          return updated.slice(updated.length - MAX_TOASTS);
        }
        return updated;
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'warning' });
    },
    [showToast]
  );

  const contextValue = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      clearToasts,
      success,
      error,
      info,
      warning,
    }),
    [toasts, showToast, dismissToast, clearToasts, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  // Create convenience wrapper matching modern toast API patterns
  const toastFn = useCallback(
    (message: string, options?: ToastOptions) => {
      return context.showToast(message, options);
    },
    [context]
  );

  return useMemo(
    () => Object.assign(toastFn, {
      success: context.success,
      error: context.error,
      info: context.info,
      warning: context.warning,
      dismiss: context.dismissToast,
      clear: context.clearToasts,
      toasts: context.toasts,
    }),
    [toastFn, context]
  );
};
