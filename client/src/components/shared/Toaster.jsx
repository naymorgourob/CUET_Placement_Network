import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

const VARIANT_STYLES = {
  success: { icon: CheckCircle2, accent: 'border-l-success', iconColor: 'text-success' },
  warning: { icon: AlertTriangle, accent: 'border-l-warning', iconColor: 'text-warning' },
  danger: { icon: XCircle, accent: 'border-l-danger', iconColor: 'text-danger' },
  info: { icon: Info, accent: 'border-l-info', iconColor: 'text-info' },
};

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 max-sm:left-1/2 max-sm:right-auto max-sm:w-[calc(100%-2rem)] max-sm:-translate-x-1/2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const variant = VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.info;
          const Icon = variant.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border-l-4 bg-surface p-4 shadow-lg',
                variant.accent
              )}
              role="status"
              aria-live="polite"
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', variant.iconColor)} />
              <div className="flex-1 text-sm">
                {toast.title && <p className="font-medium text-text">{toast.title}</p>}
                {toast.description && <p className="text-text-muted">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="text-text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
