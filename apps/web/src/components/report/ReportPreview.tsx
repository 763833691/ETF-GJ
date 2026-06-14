import { App, Button, Col, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { Copy, Download, FileClock } from 'lucide-react';
import type { ReportData } from '../../types/domain';
import { DisclaimerBlock } from '../common/DisclaimerBlock';
import { GlassCard } from '../common/GlassCard';
import { SectionHeader } from '../common/SectionHeader';
import { EvidenceList } from './EvidenceList';

type ReportPreviewProps = {
  report: ReportData;
};

const createReportText = (report: ReportData) => {
  const plans = report.plans.map((plan) => `${plan.title}：${plan.logic}`).join('\n');
  return `${report.title}
生成时间：${dayjs(report.generatedAt).format('YYYY-MM-DD HH:mm')}
数据源：${report.dataSource}

用户画像：${report.profileSummary.investmentGoal}，风险偏好 ${report.profileSummary.riskLabel}，周期 ${report.profileSummary.timeHorizon}

投教辅助方案：
${plans}

风险提示：
${report.riskNotes.map((item) => `${item.title}：${item.explanation}`).join('\n')}

${report.disclaimer}`;
};

export function ReportPreview({ report }: ReportPreviewProps) {
  const { message } = App.useApp();

  const copyReport = async () => {
    await navigator.clipboard.writeText(createReportText(report));
    message.success('报告内容已复制');
  };

  const exportHtml = () => {
    const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>${report.title}</title><body><pre>${createReportText(report)}</pre></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'etf-demo-report.html';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack">
      <GlassCard strong>
        <SectionHeader
          title={report.title}
          description="用于演示用户画像、语义世界、投教方案、场景推演和证据链的可追溯报告"
          extra={
            <Space>
              <Button icon={<Copy size={15} />} onClick={copyReport}>
                复制报告
              </Button>
              <Button type="primary" icon={<Download size={15} />} onClick={exportHtml}>
                导出 HTML
              </Button>
              <Button disabled icon={<FileClock size={15} />}>
                PDF 待接入
              </Button>
            </Space>
          }
        />
        <div className="metric-row">
          <Tag color="processing">dataSource = {report.dataSource}</Tag>
          <Tag>生成时间：{dayjs(report.generatedAt).format('YYYY-MM-DD HH:mm')}</Tag>
          <Tag color="gold">证据对象：{report.evidenceObjects.length}</Tag>
        </div>
      </GlassCard>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <GlassCard>
            <SectionHeader title="用户画像摘要" />
            <div className="profile-list">
              <div><span>目标</span><strong>{report.profileSummary.investmentGoal}</strong></div>
              <div><span>风险</span><strong>{report.profileSummary.riskLabel}</strong></div>
              <div><span>周期</span><strong>{report.profileSummary.timeHorizon}</strong></div>
              <div><span>主题</span><strong>{report.profileSummary.themePreferences.join(' / ')}</strong></div>
            </div>
          </GlassCard>
        </Col>
        <Col xs={24} lg={8}>
          <GlassCard>
            <SectionHeader title="语义世界摘要" />
            <div className="profile-list">
              <div><span>对象数</span><strong>{report.semanticWorldSummary.stats.objectCount}</strong></div>
              <div><span>关系数</span><strong>{report.semanticWorldSummary.stats.relationCount}</strong></div>
              <div><span>风险信号</span><strong>{report.semanticWorldSummary.stats.riskSignalCount}</strong></div>
              <div><span>数据源</span><strong>{report.semanticWorldSummary.dataStatus.dataSource}</strong></div>
            </div>
          </GlassCard>
        </Col>
        <Col xs={24} lg={8}>
          <GlassCard>
            <SectionHeader title="场景推演摘要" />
            <div className="mini-list">
              {report.scenarioSummary.slice(0, 3).map((item) => (
                <div className="mini-row" key={item.scenarioType}>
                  <p className="mini-row-title">{item.title}</p>
                  <p className="mini-row-body">{item.planImpact}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Col>
      </Row>

      <GlassCard>
        <SectionHeader title="投教方案摘要" />
        <Row gutter={[12, 12]}>
          {report.plans.map((plan) => (
            <Col xs={24} lg={8} key={plan.id}>
              <div className="mini-row" style={{ height: '100%' }}>
                <p className="mini-row-title">{plan.title} · {plan.matchScore}%</p>
                <p className="mini-row-body">{plan.logic}</p>
                <Tag color="processing">dataSource = {plan.dataSource}</Tag>
              </div>
            </Col>
          ))}
        </Row>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="证据对象列表" description="所有证据均为 demo_seed，用于展示证据闭环结构。" />
        <EvidenceList evidence={report.evidenceObjects} />
      </GlassCard>

      <GlassCard>
        <SectionHeader title="风险提示" />
        <div className="mini-list">
          {report.riskNotes.map((risk) => (
            <div className="mini-row" key={risk.id}>
              <p className="mini-row-title">{risk.title}</p>
              <p className="mini-row-body">{risk.explanation}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <DisclaimerBlock />
    </div>
  );
}
