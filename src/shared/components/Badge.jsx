import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-earth-100 text-earth-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-forest-100 text-forest-800',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";
export { Badge };
