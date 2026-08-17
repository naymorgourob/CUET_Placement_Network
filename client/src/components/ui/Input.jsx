import { forwardRef, useId } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(function Input(
  { label, error, helperText, required, disabled, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={cn(
          'h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className
        )}
        {...props}
      />

      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs text-danger">
          <AlertTriangle className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
