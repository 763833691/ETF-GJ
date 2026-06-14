import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  kicker?: string;
  extra?: ReactNode;
};

export function SectionHeader({ title, description, kicker, extra }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {kicker ? <div className="section-kicker">{kicker}</div> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {extra}
    </div>
  );
}
