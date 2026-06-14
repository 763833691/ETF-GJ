import type { HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type GlassCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    strong?: boolean;
    padded?: boolean;
  }
>;

export function GlassCard({ children, className, strong = false, padded = true, ...props }: GlassCardProps) {
  return (
    <div className={clsx(strong ? 'glass-card-strong' : 'glass-card', padded && 'glass-card-padded', className)} {...props}>
      {children}
    </div>
  );
}
