import * as React from 'react';
import { cn } from './utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/60', className)}
    {...props}
  />
);