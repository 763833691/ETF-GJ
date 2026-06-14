import { App, Button, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
  PanelRightOpen,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SemanticWorldGraph } from '../components/semantic-graph/SemanticWorldGraph';
import { AiPlanPanel } from '../components/workspace/AiPlanPanel';
import { DataEventStrip } from '../components/workspace/DataEventStrip';
import { GoalInputPanel } from '../components/workspace/GoalInputPanel';
import { InvestorProfileCard } from '../components/workspace/InvestorProfileCard';
import { api, type WorkspaceGenerateInput } from '../services/api';
import { TOUR_STEP_ENTER_EVENT, type TourPrepareAction } from '../components/onboarding/tourSteps';
import type {
  BootstrapData,
  InvestorProfile,
  SemanticGraphResponse,
  StrategyPlan,
} from '../types/domain';

type OpenPanel = 'input' | 'plan' | null;

export function WorkspacePage() {
  const { message } = App.useApp();
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [graph, setGraph] = useState<SemanticGraphResponse | null>(null);
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [plans, setPlans] = useState<StrategyPlan[]>([]);
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>([]);
  const [highlightEdgeIds, setHighlightEdgeIds] = useState<string[]>([]);
  const [modelStatus, setModelStatus] = useState('not_configured');
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [analysisSummary, setAnalysisSummary] = useState('');

  useEffect(() => {
    Promise.all([api.getBootstrap(), api.getSemanticGraph(), api.getModelConfig()])
      .then(([bootstrapData, graphData, modelConfig]) => {
        setBootstrap(bootstrapData);
        setGraph(graphData);
        setProfile(bootstrapData.profile);
        setPlans(bootstrapData.plans);
        setModelStatus(modelConfig.configured ? 'configured' : 'not_configured');
      })
      .catch(() => {
        Promise.all([api.getBootstrap(), api.getSemanticGraph()]).then(
          ([bootstrapData, graphData]) => {
            setBootstrap(bootstrapData);
            setGraph(graphData);
            setProfile(bootstrapData.profile);
            setPlans(bootstrapData.plans);
            setModelStatus(bootstrapData.dataStatus.modelStatus);
          },
        );
      });
  }, []);

  useEffect(() => {
    const refreshModelStatus = () => {
      api
        .getModelConfig()
        .then((modelConfig) => {
          setModelStatus(modelConfig.configured ? 'configured' : 'not_configured');
        })
        .catch(() => {});
    };

    window.addEventListener('model-config-updated', refreshModelStatus);
    return () => window.removeEventListener('model-config-updated', refreshModelStatus);
  }, []);

  useEffect(() => {
    const onTourStep = (event: Event) => {
      const prepare = (event as CustomEvent<{ prepare?: TourPrepareAction }>).detail?.prepare;
      if (prepare === 'open-input-panel') setOpenPanel('input');
      if (prepare === 'open-plan-panel') setOpenPanel('plan');
      if (prepare === 'close-panels') setOpenPanel(null);
    };

    window.addEventListener(TOUR_STEP_ENTER_EVENT, onTourStep);
    return () => window.removeEventListener(TOUR_STEP_ENTER_EVENT, onTourStep);
  }, []);

  const handleGenerate = async (payload: WorkspaceGenerateInput) => {
    try {
      const generated = await api.generateWorkspace(payload);
      setProfile(generated.profile);
      setPlans(generated.plans);
      setModelStatus(generated.model.status);
      setHighlightNodeIds(generated.graphPatch.highlightNodeIds);
      setHighlightEdgeIds(generated.graphPatch.highlightEdgeIds);
      setAnalysisSummary(generated.analysisSummary);
      setGraph((current) => {
        if (!current) return current;
        return {
          ...current,
          nodes: generated.graphPatch.nodes,
          edges: generated.graphPatch.edges,
          dataStatus: {
            ...current.dataStatus,
            dataSource: 'model_generated',
            modelStatus: 'configured',
          },
          stats: {
            ...current.stats,
            objectCount: generated.graphPatch.nodes.length,
            relationCount: generated.graphPatch.edges.length,
          },
        };
      });
      setOpenPanel('plan');
      window.dispatchEvent(new Event('model-config-updated'));
      message.success(
        `已由 ${generated.model.model} 生成投资图谱（${generated.graphPatch.nodes.length} 个节点 / ${generated.graphPatch.edges.length} 条关系）`,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成投资图谱失败';
      message.error(errorMessage);
    }
  };

  if (!bootstrap || !graph) {
    return (
      <GlassCard strong>
        <Skeleton active paragraph={{ rows: 12 }} />
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <GlassCard strong className="workspace-hero">
        <SectionHeader
          title="主工作台"
          description={bootstrap.app.subtitle}
          extra={
            <div className="metric-row">
              <StatusBadge>dataSource = {bootstrap.dataStatus.dataSource}</StatusBadge>
              <StatusBadge
                tone={modelStatus === 'configured' ? 'success' : 'warning'}
                icon={<BrainCircuit size={13} />}
              >
                {modelStatus === 'configured' ? '真实模型已连接' : '演示模式'}
              </StatusBadge>
              <StatusBadge tone="success">抽屉式工作区</StatusBadge>
            </div>
          }
        />
      </GlassCard>

      <div className="workspace-stage">
        <GlassCard strong className="workspace-canvas-card" data-tour="graph-canvas">
          <SemanticWorldGraph
            nodes={graph.nodes}
            edges={graph.edges}
            dataStatus={{ ...graph.dataStatus, modelStatus }}
            highlightNodeIds={highlightNodeIds}
            highlightEdgeIds={highlightEdgeIds}
          />
        </GlassCard>

        <button
          type="button"
          className="workspace-panel-tab workspace-panel-tab-left"
          data-tour="panel-input"
          aria-label="目标与画像"
          aria-expanded={openPanel === 'input'}
          onClick={() =>
            setOpenPanel((current) => (current === 'input' ? null : 'input'))
          }
        >
          {openPanel === 'input' ? <ChevronLeft size={16} /> : <PanelLeftOpen size={16} />}
          <span>目标与画像</span>
        </button>

        <button
          type="button"
          className="workspace-panel-tab workspace-panel-tab-right"
          data-tour="panel-plan"
          aria-label="AI 投教方案"
          aria-expanded={openPanel === 'plan'}
          onClick={() =>
            setOpenPanel((current) => (current === 'plan' ? null : 'plan'))
          }
        >
          <span>AI 投教方案</span>
          {openPanel === 'plan' ? <ChevronRight size={16} /> : <PanelRightOpen size={16} />}
        </button>

        {openPanel ? (
          <button
            type="button"
            aria-label="关闭侧边面板"
            className="workspace-panel-scrim"
            onClick={() => setOpenPanel(null)}
          />
        ) : null}

        <aside
          className={`workspace-drawer workspace-drawer-left ${
            openPanel === 'input' ? 'open' : ''
          }`}
          aria-hidden={openPanel !== 'input'}
        >
          <div className="workspace-drawer-head">
            <div>
              <strong>目标与画像</strong>
              <span>输入条件并生成投教理解画像</span>
            </div>
            <Button
              type="text"
              icon={<X size={17} />}
              aria-label="关闭目标与画像"
              onClick={() => setOpenPanel(null)}
            />
          </div>
          <div className="workspace-drawer-body stack">
            <GoalInputPanel modelReady={modelStatus === 'configured'} onGenerate={handleGenerate} />
            <InvestorProfileCard profile={profile} />
          </div>
        </aside>

        <aside
          className={`workspace-drawer workspace-drawer-right ${
            openPanel === 'plan' ? 'open' : ''
          }`}
          aria-hidden={openPanel !== 'plan'}
        >
          <div className="workspace-drawer-head">
            <div>
              <strong>AI 投教方案</strong>
              <span>查看模型分析、方案与证据链</span>
            </div>
            <Button
              type="text"
              icon={<X size={17} />}
              aria-label="关闭 AI 投教方案"
              onClick={() => setOpenPanel(null)}
            />
          </div>
          <div className="workspace-drawer-body">
            {analysisSummary ? (
              <div className="model-analysis-summary">
                <strong>模型理解</strong>
                <p>{analysisSummary}</p>
              </div>
            ) : null}
            <AiPlanPanel
              plans={plans}
              evidence={bootstrap.evidenceObjects}
              modelStatus={modelStatus}
            />
          </div>
        </aside>
      </div>

      <div className="workspace-bottom">
        <DataEventStrip
          newsEvents={bootstrap.newsEvents}
          riskSignals={bootstrap.riskSignals}
          evidence={bootstrap.evidenceObjects}
        />
      </div>
    </motion.div>
  );
}
