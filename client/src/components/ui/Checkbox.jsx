import { useId } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Checkbox({ label, checked, onCheckedChange, disabled, className, id, ...props }) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-surface',
          'transition-colors duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label htmlFor={checkboxId} className="cursor-pointer text-sm text-text">
          {label}
        </label>
      )}
    </div>
  );
}
