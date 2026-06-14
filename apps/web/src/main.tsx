import '@ant-design/v5-patch-for-react-19';
import '@xyflow/react/dist/style.css';
import './styles/theme.css';
import './styles/glass.css';
import './styles/graph.css';
import './styles/globals.css';
import './styles/onboarding.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { router } from './app/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#326ea6',
          borderRadius: 12,
          fontFamily:
            'Inter, Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Button: {
            controlHeight: 38,
            borderRadius: 12,
          },
          Card: {
            borderRadiusLG: 18,
          },
          Table: {
            borderRadius: 14,
            headerBg: 'rgba(238,245,255,0.72)',
          },
        },
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);
