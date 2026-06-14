import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TOUR_SKIPPED_STORAGE_KEY,
  TOUR_STEP_ENTER_EVENT,
  tourSteps,
  type TourStep,
} from './tourSteps';

type OnboardingContextValue = {
  active: boolean;
  stepIndex: number;
  step: TourStep;
  totalSteps: number;
  startTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const dispatchPrepare = (step: TourStep) => {
  if (!step.prepare) return;
  window.dispatchEvent(
    new CustomEvent(TOUR_STEP_ENTER_EVENT, { detail: { prepare: step.prepare } }),
  );
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [pendingStepIndex, setPendingStepIndex] = useState<number | null>(null);

  const step = tourSteps[stepIndex];
  const totalSteps = tourSteps.length;

  const applyStep = useCallback(
    (index: number) => {
      const nextStep = tourSteps[index];
      if (!nextStep) return;

      if (nextStep.route && location.pathname !== nextStep.route) {
        setPendingStepIndex(index);
        navigate(nextStep.route);
        return;
      }

      setStepIndex(index);
      dispatchPrepare(nextStep);
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    if (pendingStepIndex === null) return;

    const pendingStep = tourSteps[pendingStepIndex];
    if (pendingStep.route && location.pathname !== pendingStep.route) return;

    setStepIndex(pendingStepIndex);
    dispatchPrepare(pendingStep);
    setPendingStepIndex(null);
  }, [location.pathname, pendingStepIndex]);

  const startTour = useCallback(() => {
    setActive(true);
    applyStep(0);
  }, [applyStep]);

  const skipTour = useCallback(() => {
    localStorage.setItem(TOUR_SKIPPED_STORAGE_KEY, '1');
    setActive(false);
    setStepIndex(0);
    setPendingStepIndex(null);
    window.dispatchEvent(
      new CustomEvent(TOUR_STEP_ENTER_EVENT, { detail: { prepare: 'close-panels' } }),
    );
  }, []);

  const nextStep = useCallback(() => {
    if (stepIndex >= tourSteps.length - 1) {
      setActive(false);
      setStepIndex(0);
      setPendingStepIndex(null);
      window.dispatchEvent(
        new CustomEvent(TOUR_STEP_ENTER_EVENT, { detail: { prepare: 'close-panels' } }),
      );
      return;
    }
    applyStep(stepIndex + 1);
  }, [applyStep, stepIndex]);

  const prevStep = useCallback(() => {
    if (stepIndex <= 0) return;
    applyStep(stepIndex - 1);
  }, [applyStep, stepIndex]);

  const value = useMemo(
    () => ({
      active,
      stepIndex,
      step,
      totalSteps,
      startTour,
      skipTour,
      nextStep,
      prevStep,
    }),
    [active, nextStep, prevStep, skipTour, startTour, step, stepIndex, totalSteps],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
