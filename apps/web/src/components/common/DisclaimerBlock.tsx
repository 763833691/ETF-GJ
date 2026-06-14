import { ShieldCheck } from 'lucide-react';
import { DISCLAIMER } from '../../data/demoSeed';

type DisclaimerBlockProps = {
  compact?: boolean;
};

export function DisclaimerBlock({ compact = false }: DisclaimerBlockProps) {
  return (
    <div className="disclaimer">
      <ShieldCheck size={compact ? 14 : 16} style={{ marginRight: 6, verticalAlign: '-3px' }} />
      {DISCLAIMER}
    </div>
  );
}
