import { Outlet } from 'react-router-dom';
import { OnboardingHelpButton } from '../onboarding/OnboardingHelpButton';
import { OnboardingPrompt } from '../onboarding/OnboardingPrompt';
import { OnboardingProvider } from '../onboarding/OnboardingContext';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import { TopNav } from './TopNav';
import { DisclaimerBlock } from '../common/DisclaimerBlock';

export function AppShell() {
  return (
    <OnboardingProvider>
      <div className="app-shell">
        <TopNav />
        <main className="app-main">
          <Outlet />
          <div style={{ marginTop: 16 }}>
            <DisclaimerBlock compact />
          </div>
        </main>
        <OnboardingPrompt />
        <OnboardingTour />
        <OnboardingHelpButton />
      </div>
    </OnboardingProvider>
  );
}
