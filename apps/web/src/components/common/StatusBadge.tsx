import clsx from 'clsx';
import type { ReactNode } from 'react';

type StatusBadgeProps = {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'warning' | 'success';
  icon?: ReactNode;
};

export function StatusBadge({ children, icon, tone = 'default' }: StatusBadgeProps) {
  return (
    <span className={clsx('status-badge', tone !== 'default' && tone)}>
      {icon}
      {children}
    </span>
  );
}
