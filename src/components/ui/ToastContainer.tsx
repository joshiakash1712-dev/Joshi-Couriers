import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Package, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ToastItem } from '../../types';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

interface SingleToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const SingleToast: React.FC<SingleToastProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 5000;
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (duration <= 0) return;

    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = 50;
    timerRef.current = window.setInterval(() => {
      remainingTimeRef.current -= interval;
      const pct = Math.max(0, (remainingTimeRef.current / duration) * 100);
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        onDismiss(toast.id);
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, isPaused, toast.id, onDismiss]);

  const getThemeConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          accentBorder: 'border-emerald-500/30',
          progressBar: 'bg-emerald-500',
          glow: 'shadow-[0_12px_40px_rgba(16,185,129,0.18)]',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          accentBorder: 'border-rose-500/30',
          progressBar: 'bg-rose-500',
          glow: 'shadow-[0_12px_40px_rgba(244,63,94,0.18)]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          accentBorder: 'border-amber-500/30',
          progressBar: 'bg-amber-500',
          glow: 'shadow-[0_12px_40px_rgba(245,158,11,0.18)]',
        };
      case 'info':
      default:
        return {
          icon: <Package className="w-5 h-5 text-[#0038BD] dark:text-blue-400" />,
          iconBg: 'bg-[#0038BD]/15 dark:bg-blue-500/15 border-[#0038BD]/30 dark:border-blue-400/30 text-[#0038BD] dark:text-blue-400',
          accentBorder: 'border-[#0038BD]/30 dark:border-blue-400/30',
          progressBar: 'bg-[#0038BD] dark:bg-blue-400',
          glow: 'shadow-[0_12px_40px_rgba(0,56,189,0.18)]',
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={`pointer-events-auto relative w-full sm:w-[420px] max-w-full overflow-hidden rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-2xl border border-white/15 ${theme.glow} transition-all duration-200 select-none`}
    >
      {/* Subtle top rim specular highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      <div className="p-4 sm:p-4.5 flex items-start gap-3.5">
        {/* Status Icon Badge */}
        <div className={`p-2 rounded-xl border shrink-0 flex items-center justify-center ${theme.iconBg}`}>
          {theme.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <h5 className="text-sm font-bold tracking-tight text-white flex items-center gap-2 mb-0.5">
              <span>{toast.title}</span>
            </h5>
          )}
          <p className="text-xs text-slate-300 dark:text-slate-300 leading-relaxed break-words font-normal">
            {toast.message}
          </p>

          {/* Optional Meta Information (Tracking ID, Corridor, Fare) */}
          {toast.meta && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10">
              {toast.meta.trackingId && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] font-bold border border-white/10">
                  <Package className="w-3 h-3 text-[#EF8E01]" />
                  <span>{toast.meta.trackingId}</span>
                </span>
              )}
              {toast.meta.route && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[11px] font-medium border border-blue-400/20">
                  <span>{toast.meta.route}</span>
                </span>
              )}
              {toast.meta.fee !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[11px] font-medium border border-emerald-400/20">
                  <span>₹{toast.meta.fee} on Delivery</span>
                </span>
              )}
            </div>
          )}

          {/* Optional Action Button */}
          {toast.action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-[0.98] text-white text-xs font-semibold transition-all cursor-pointer border border-white/15 shadow-2xs focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <span>{toast.action.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar (pauses on hover) */}
      {duration > 0 && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
          <div 
            className={`h-full ${theme.progressBar} transition-[width] duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      aria-label="Notifications"
      className="fixed z-[100] bottom-4 inset-x-3 sm:bottom-6 sm:right-6 sm:inset-x-auto flex flex-col items-center sm:items-end gap-2.5 pointer-events-none max-w-full"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
