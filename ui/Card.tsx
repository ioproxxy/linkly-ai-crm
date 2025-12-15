import * as React from 'react';
import { cn } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl shadow-sm',
      className,
    )}
    {...props}
  />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('px-5 pt-4 pb-3 flex items-center justify-between', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-50', className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('px-5 pb-4 pt-1', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('px-5 pb-4 pt-2 border-t border-slate-100/80 dark:border-slate-800', className)} {...props} />
);