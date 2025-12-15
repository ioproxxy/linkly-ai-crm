import * as React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-500 focus-visible:ring-offset-slate-900',
    secondary:
      'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-900',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-900',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-sm',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
};