import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANT_CLASSES = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-secondary text-white hover:opacity-90 dark:text-secondary dark:bg-transparent dark:border dark:border-secondary',
  outline: 'border border-border bg-transparent text-text hover:bg-surface-muted',
  ghost: 'bg-transparent text-text hover:bg-surface-muted',
  destructive: 'bg-danger text-white hover:opacity-90',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  default: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      )}
      {children}
      {!isLoading && RightIcon && <RightIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
    </button>
  );
});
