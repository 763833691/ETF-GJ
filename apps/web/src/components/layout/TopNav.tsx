import { Button, Tooltip } from 'antd';
import {
  Activity,
  BrainCircuit,
  Database,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Network,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';

const navItems = [
  { path: '/', label: '工作台', icon: LayoutDashboard },
  { path: '/scenario', label: '场景推演', icon: FlaskConical },
  { path: '/report', label: '证据报告', icon: FileText },
  { path: '/system/swm', label: 'SWM 调试台', icon: Network },
  { path: '/system/status', label: '系统状态', icon: Activity },
  { path: '/system/model', label: '模型配置', icon: Settings2 },
];

export function TopNav() {
  const navigate = useNavigate();
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      api.getModelConfig().then((config) => setModelReady(config.configured)).catch(() => setModelReady(false));
    };
    refresh();
    window.addEventListener('model-config-updated', refresh);
    return () => window.removeEventListener('model-config-updated', refresh);
  }, []);

  return (
    <header className="top-nav glass-card">
      <div className="brand-mark">
        <div className="brand-orb" aria-hidden="true" />
        <div>
          <div className="brand-title">ETF 智能投教平台</div>
          <div className="brand-subtitle">数据驱动 · 语义驱动 · 证据闭环</div>
        </div>
      </div>

      <nav className="nav-links" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-tour={item.path === '/' ? 'nav-workspace' : item.path === '/system/model' ? 'nav-model' : undefined}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="nav-status">
        <StatusBadge icon={<Database size={13} />}>dataSource = demo_seed</StatusBadge>
        <StatusBadge tone={modelReady ? 'success' : 'warning'} icon={<BrainCircuit size={13} />}>
          模型{modelReady ? '已连接' : '未配置'}
        </StatusBadge>
        <Tooltip title="查看证据链报告">
          <Button type="primary" icon={<FileText size={15} />} onClick={() => navigate('/report')}>
            导出报告
          </Button>
        </Tooltip>
        <Tooltip title="本平台内容仅用于投资教育和辅助分析">
          <span>
            <StatusBadge tone="success" icon={<ShieldCheck size={13} />}>免责声明</StatusBadge>
          </span>
        </Tooltip>
      </div>
    </header>
  );
}
