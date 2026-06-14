import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <GlassCard strong>
      <SectionHeader title="页面未找到" description="当前 Demo 仅开放主工作台、场景推演、证据报告和只读系统页面。" />
      <Button type="primary" onClick={() => navigate('/')}>
        返回工作台
      </Button>
    </GlassCard>
  );
}
