import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  default: 'max-w-md',
  lg: 'max-w-xl',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'default',
  closeOnBackdropClick = true,
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/40"
                onClick={(event) => {
                  if (!closeOnBackdropClick) {
                    event.preventDefault();
                  }
                }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              forceMount
              onPointerDownOutside={(event) => {
                if (!closeOnBackdropClick) {
                  event.preventDefault();
                }
              }}
              className={cn(
                'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface shadow-lg',
                SIZE_CLASSES[size]
              )}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-border p-6">
                  <div>
                    {title && (
                      <DialogPrimitive.Title className="text-lg font-semibold text-text">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description className="mt-1 text-sm text-text-muted">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close
                    aria-label="Close dialog"
                    className="text-text-muted hover:text-text"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </DialogPrimitive.Close>
                </div>

                <div className="p-6">{children}</div>

                {footer && <div className="flex justify-end gap-2 border-t border-border p-6">{footer}</div>}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
