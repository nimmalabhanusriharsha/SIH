import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
  const variants = {
    primary: 'bg-farmer-primary text-white hover:bg-farmer-primary shadow-sm',
    secondary: 'bg-white text-farmer-primary border border-farmer-border hover:bg-farmer-primary-light shadow-sm',
    outline: 'border border-earth-300 bg-transparent hover:bg-earth-100 text-farmer-text',
    ghost: 'hover:bg-earth-100 hover:text-farmer-text text-earth-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export { Button };
