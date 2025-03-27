import React from 'react';
import { cn } from '@/lib/utils';

const ZhangTextarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 zhang-text resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

ZhangTextarea.displayName = "ZhangTextarea";

export { ZhangTextarea }; 