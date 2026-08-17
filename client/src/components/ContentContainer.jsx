import { cn } from '@/utils/cn';

export function ContentContainer({ children, className }) {
  return <div className={cn('mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8', className)}>{children}</div>;
}
