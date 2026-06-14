import { Button, Input, InputNumber, Select, Segmented, Slider, Space, Tag } from 'antd';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '../common/GlassCard';

type GoalInputPanelProps = {
  modelReady?: boolean;
  onGenerate: (payload: {
    naturalLanguageGoal: string;
    riskPreference: string;
    monthlyBudget: number;
    investmentHorizon: string;
    themePreferences: string[];
    experienceLevel: string;
  }) => Promise<void>;
};

const defaultGoal =
  '我每月想定投 1000 元，投资周期 3 年，风险偏好中等，想了解宽基、红利和科技 ETF。我是新手，希望先学习风险和配置逻辑。';

const themeOptions = ['宽基', '红利', '科技', '消费', '债券', '货币'];

export function GoalInputPanel({ modelReady = false, onGenerate }: GoalInputPanelProps) {
  const [goal, setGoal] = useState(defaultGoal);
  const [budget, setBudget] = useState(1000);
  const [horizon, setHorizon] = useState('3 年');
  const [risk, setRisk] = useState('medium');
  const [experience, setExperience] = useState('beginner');
  const [themes, setThemes] = useState<string[]>(['宽基', '红利', '科技']);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerate({
        naturalLanguageGoal: goal,
        riskPreference: risk,
        monthlyBudget: budget,
        investmentHorizon: horizon,
        themePreferences: themes,
        experienceLevel: experience,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="stack">
        <Input.TextArea
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          autoSize={{ minRows: 4, maxRows: 6 }}
          maxLength={220}
          showCount
        />

        <div>
          <div className="field-label">每月预算</div>
          <Space.Compact style={{ width: '100%' }}>
            <InputNumber
              value={budget}
              min={100}
              max={100000}
              step={100}
              style={{ width: 'calc(100% - 44px)' }}
              onChange={(value) => setBudget(Number(value ?? 1000))}
            />
            <Button disabled style={{ width: 44 }}>
              元
            </Button>
          </Space.Compact>
        </div>

        <div>
          <div className="field-label">投资周期</div>
          <Segmented
            block
            value={horizon}
            options={['1 年', '3 年', '5 年以上']}
            onChange={(value) => setHorizon(String(value))}
          />
        </div>

        <div>
          <div className="field-label">风险偏好</div>
          <Slider
            min={0}
            max={4}
            value={{ low: 1, medium: 2, high: 3 }[risk] ?? 2}
            marks={{ 0: '保守', 1: '稳健', 2: '均衡', 3: '成长', 4: '进取' }}
            tooltip={{ formatter: null }}
            onChange={(value) => {
              const next = value <= 1 ? 'low' : value >= 3 ? 'high' : 'medium';
              setRisk(next);
            }}
          />
        </div>

        <div>
          <div className="field-label">投资经验</div>
          <Segmented
            block
            value={experience}
            options={[
              { label: '新手', value: 'beginner' },
              { label: '了解一些', value: 'intermediate' },
              { label: '进阶', value: 'advanced' },
            ]}
            onChange={(value) => setExperience(String(value))}
          />
        </div>

        <div>
          <div className="field-label">关注方向</div>
          <Select
            mode="multiple"
            value={themes}
            options={themeOptions.map((item) => ({ label: item, value: item }))}
            onChange={setThemes}
            style={{ width: '100%' }}
          />
          <Space size={[6, 6]} wrap style={{ marginTop: 8 }}>
            {themes.map((item) => (
              <Tag key={item} bordered={false} color="blue">
                {item}
              </Tag>
            ))}
          </Space>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<Sparkles size={16} />}
          loading={loading}
          disabled={!modelReady}
          onClick={handleGenerate}
          block
          data-tour="generate-graph"
        >
          生成投资图谱
        </Button>
        {!modelReady ? (
          <p className="field-hint">请先在「模型配置」中启用真实模型并保存 API Key。</p>
        ) : null}
      </div>
    </GlassCard>
  );
}
