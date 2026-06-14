import { Tooltip } from 'antd';
import { CircleHelp } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

export function OnboardingHelpButton() {
  const { active, startTour } = useOnboarding();

  if (active) return null;

  return (
    <Tooltip title="查看平台使用教程" placement="left">
      <button
        type="button"
        className="onboarding-help-fab"
        aria-label="打开平台使用教程"
        onClick={startTour}
      >
        <CircleHelp size={22} />
      </button>
    </Tooltip>
  );
}
