import * as React from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:hover:bg-orange-800 dark:hover:text-orange-100 disabled:opacity-50 dark:focus:ring-orange-400 disabled:pointer-events-none dark:focus:ring-offset-orange-900 data-[state=open]:bg-orange-100 dark:data-[state=open]:bg-orange-800',
  {
    variants: {
      variant: {
        default:
          'bg-orange-400 text-white hover:bg-orange-400/80 dark:bg-orange-50 dark:text-orange-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'bg-transparent border border-orange-200 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-100',
        subtle:
          'bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-700 dark:text-orange-100',
        ghost:
          'bg-transparent hover:bg-orange-100 dark:hover:bg-orange-800 hover:text-orange-700 dark:text-orange-100 dark:hover:text-orange-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-orange-500 dark:text-orange-100 hover:bg-transparent dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
