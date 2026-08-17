import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  isLoading = false,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      closeOnBackdropClick={false}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {variant === 'destructive' && (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
        )}
        <div>
          <p className="text-sm font-medium text-text">{title}</p>
          {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
        </div>
      </div>
    </Modal>
  );
}
