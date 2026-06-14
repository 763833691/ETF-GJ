import { Button } from 'antd';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from './OnboardingContext';

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type PopoverPosition = {
  top: number;
  left: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function OnboardingTour() {
  const { active, step, stepIndex, totalSteps, nextStep, prevStep, skipTour } = useOnboarding();
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [popover, setPopover] = useState<PopoverPosition>({ top: 0, left: 0 });
  const isCenter = step.placement === 'center' || !step.target;

  const updateLayout = () => {
    if (!active) return;

    if (isCenter) {
      setSpotlight(null);
      setPopover({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
      return;
    }

    const target = document.querySelector(step.target ?? '');
    if (!target) {
      setSpotlight(null);
      setPopover({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
      return;
    }

    const rect = target.getBoundingClientRect();
    const padding = 8;
    setSpotlight({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    const popoverWidth = 360;
    const popoverHeight = 220;
    let top = rect.bottom + 16;
    let left = rect.left;

    if (step.placement === 'top') {
      top = rect.top - popoverHeight - 16;
    }
    if (step.placement === 'left') {
      top = rect.top;
      left = rect.left - popoverWidth - 16;
    }
    if (step.placement === 'right') {
      top = rect.top;
      left = rect.right + 16;
    }
    if (step.placement === 'bottom') {
      top = rect.bottom + 16;
      left = rect.left;
    }

    setPopover({
      top: clamp(top, 16, window.innerHeight - popoverHeight - 16),
      left: clamp(left, 16, window.innerWidth - popoverWidth - 16),
    });
  };

  useLayoutEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(updateLayout, step.prepare ? 280 : 80);
    return () => window.clearTimeout(timer);
  }, [active, step, stepIndex]);

  useEffect(() => {
    if (!active) return;
    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateLayout, true);
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateLayout, true);
    };
  }, [active, step, stepIndex]);

  if (!active) return null;

  const isLast = stepIndex >= totalSteps - 1;

  return createPortal(
    <div className="onboarding-root" role="dialog" aria-modal="true" aria-label="平台使用教程">
      <div className="onboarding-overlay" />
      {spotlight ? (
        <div
          className="onboarding-spotlight"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}
      <div
        className={`onboarding-popover ${isCenter ? 'centered' : ''}`}
        style={
          isCenter
            ? undefined
            : {
                top: popover.top,
                left: popover.left,
              }
        }
      >
        <div className="onboarding-popover-kicker">
          {stepIndex === 0 ? '快速上手' : `第 ${stepIndex}/${totalSteps - 1} 步`}
        </div>
        <h3 className="onboarding-popover-title">{step.title}</h3>
        <p className="onboarding-popover-body">{step.content}</p>
        <div className="onboarding-popover-actions">
          <Button type="text" onClick={skipTour}>
            跳过
          </Button>
          <div className="onboarding-popover-nav">
            <Button disabled={stepIndex === 0} onClick={prevStep}>
              上一步
            </Button>
            <Button type="primary" onClick={nextStep}>
              {isLast ? '完成' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
