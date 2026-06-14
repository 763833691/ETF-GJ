import { Modal } from 'antd';
import { CircleHelp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboarding } from './OnboardingContext';
import { TOUR_SKIPPED_STORAGE_KEY } from './tourSteps';

export function OnboardingPrompt() {
  const location = useLocation();
  const { active, startTour } = useOnboarding();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setOpen(false);
      return;
    }
    if (active) return;
    if (localStorage.getItem(TOUR_SKIPPED_STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => {
      window.clearTimeout(timer);
    };
  }, [active, location.pathname]);

  const handleAccept = () => {
    setOpen(false);
    startTour();
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_SKIPPED_STORAGE_KEY, '1');
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      centered
      closable={false}
      maskClosable={false}
      footer={null}
      width={420}
      className="onboarding-prompt-modal"
    >
      <div className="onboarding-prompt">
        <div className="onboarding-prompt-icon" aria-hidden="true">
          <CircleHelp size={28} />
        </div>
        <h3>是否需要平台使用教程？</h3>
        <p>
          我们将用约 1 分钟带你了解模型配置、填写目标、生成投资图谱和查看 AI 投教方案。你也可以随时点击右下角问号重新打开。
        </p>
        <div className="onboarding-prompt-actions">
          <button type="button" className="onboarding-prompt-skip" onClick={handleSkip}>
            跳过
          </button>
          <button type="button" className="onboarding-prompt-start" onClick={handleAccept}>
            开始教程
          </button>
        </div>
      </div>
    </Modal>
  );
}
