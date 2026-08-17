import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCommandPalette } from '@/hooks/useCommandPalette';

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Search jobs, applicants, pages..."
                disabled
                className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none disabled:cursor-not-allowed"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-text-muted">Esc</kbd>
            </div>
            <div className="px-4 py-8 text-center text-sm text-text-muted">Search is not available yet.</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
