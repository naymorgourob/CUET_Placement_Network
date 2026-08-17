import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/utils/cn';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({ children, align = 'end', className }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={4}
        className={cn(
          'z-50 min-w-[160px] overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-md',
          className
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ children, destructive = false, className, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none',
        'data-[highlighted]:bg-surface-muted data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        destructive ? 'text-danger' : 'text-text',
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuSeparator() {
  return <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />;
}
