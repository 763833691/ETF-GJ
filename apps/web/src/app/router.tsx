import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { WorkspacePage } from '../pages/WorkspacePage';
import { ScenarioPage } from '../pages/ScenarioPage';
import { ReportPage } from '../pages/ReportPage';
import { SystemSwmPage } from '../pages/SystemSwmPage';
import { SystemStatusPage } from '../pages/SystemStatusPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ModelConfigPage } from '../pages/ModelConfigPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <WorkspacePage /> },
      { path: 'scenario', element: <ScenarioPage /> },
      { path: 'report', element: <ReportPage /> },
      { path: 'system/swm', element: <SystemSwmPage /> },
      { path: 'system/status', element: <SystemStatusPage /> },
      { path: 'system/model', element: <ModelConfigPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
