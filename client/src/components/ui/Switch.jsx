import { useId } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/utils/cn';

export function Switch({ label, checked, onCheckedChange, disabled, className, id }) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <SwitchPrimitive.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full bg-surface-muted transition-colors duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary',
          className
        )}
      >
        <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-[18px]" />
      </SwitchPrimitive.Root>

      {label && (
        <label htmlFor={switchId} className="cursor-pointer text-sm text-text">
          {label}
        </label>
      )}
    </div>
  );
}
