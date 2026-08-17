import { useId } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Select({
  label,
  error,
  helperText,
  required,
  disabled,
  placeholder = 'Select an option',
  value,
  onValueChange,
  options = [],
  className,
}) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 text-sm text-text',
            'transition-colors duration-100',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
            'data-[placeholder]:text-text-muted',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className="z-50 overflow-hidden rounded-lg border border-border bg-surface shadow-md"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-text outline-none',
                    'data-[highlighted]:bg-surface-muted data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
                  )}
                >
                  <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
