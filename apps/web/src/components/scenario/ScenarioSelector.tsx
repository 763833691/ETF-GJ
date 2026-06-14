import { Button } from 'antd';
import { FlaskConical } from 'lucide-react';
import type { ScenarioResult } from '../../types/domain';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';

type ScenarioSelectorProps = {
  scenarios: ScenarioResult[];
  activeType: string;
  onSelect: (scenarioType: string) => void;
};

export function ScenarioSelector({ scenarios, activeType, onSelect }: ScenarioSelectorProps) {
  return (
    <GlassCard>
      <SectionHeader title="场景选择" description="观察世界状态变化如何影响风险解释" />
      <div className="stack">
        {scenarios.map((scenario) => (
          <Button
            key={scenario.scenarioType}
            type={activeType === scenario.scenarioType ? 'primary' : 'default'}
            icon={<FlaskConical size={15} />}
            onClick={() => onSelect(scenario.scenarioType)}
            style={{ justifyContent: 'flex-start' }}
          >
            {scenario.title}
          </Button>
        ))}
      </div>
    </GlassCard>
  );
}
