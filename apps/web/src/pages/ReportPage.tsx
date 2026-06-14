import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ReportPreview } from '../components/report/ReportPreview';
import { GlassCard } from '../components/common/GlassCard';
import { api } from '../services/api';
import type { ReportData } from '../types/domain';

export function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    api.getReport().then((data: any) => setReport(data.report));
  }, []);

  if (!report) {
    return (
      <GlassCard strong>
        <Skeleton active paragraph={{ rows: 14 }} />
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <ReportPreview report={report} />
    </motion.div>
  );
}
