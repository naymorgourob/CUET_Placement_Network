import { useState } from 'react';
import { cn } from '@/utils/cn';
import { env } from '@/utils/env';
import { getResourceCategory } from '@/utils/resourceCategories';

export function ResourceCoverImage({ coverImagePath, category, className, iconClassName }) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = coverImagePath ? `${env.uploadBaseUrl}/${coverImagePath.replace(/^\/?/, '')}` : null;
  const { icon: Icon, label } = getResourceCategory(category);

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={label}
        className={cn('h-full w-full object-cover', className)}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={cn('flex h-full w-full items-center justify-center bg-primary/5', className)}>
      <Icon className={cn('h-8 w-8 text-primary/40', iconClassName)} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
