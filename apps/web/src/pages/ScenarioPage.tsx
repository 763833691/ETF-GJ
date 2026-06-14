import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ScenarioImpactPanel } from '../components/scenario/ScenarioImpactPanel';
import { ScenarioSelector } from '../components/scenario/ScenarioSelector';
import { SemanticWorldGraph } from '../components/semantic-graph/SemanticWorldGraph';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { demoSeed, getLocalScenario } from '../data/demoSeed';
import { api } from '../services/api';
import type { EvidenceObject, ScenarioResult, SemanticGraphResponse } from '../types/domain';

export function ScenarioPage() {
  const scenarios = demoSeed.scenarios as ScenarioResult[];
  const evidence = demoSeed.evidenceObjects as EvidenceObject[];
  const [activeType, setActiveType] = useState(scenarios[0].scenarioType);
  const [scenario, setScenario] = useState<ScenarioResult>(getLocalScenario(scenarios[0].scenarioType).scenarioRun);
  const [graph, setGraph] = useState<SemanticGraphResponse | null>(null);
  const [highlightNodeIds, setHighlightNodeIds] = useState<string[]>(scenario.highlightNodeIds);
  const [highlightEdgeIds, setHighlightEdgeIds] = useState<string[]>(scenario.highlightEdgeIds);

  useEffect(() => {
    api.getSemanticGraph().then(setGraph);
  }, []);

  const selectScenario = async (scenarioType: string) => {
    setActiveType(scenarioType);
    const result = (await api.simulateScenario(scenarioType)) as {
      scenarioRun: ScenarioResult;
      graphPatch: { highlightNodeIds: string[]; highlightEdgeIds: string[] };
    };
    setScenario(result.scenarioRun);
    setHighlightNodeIds(result.graphPatch.highlightNodeIds);
    setHighlightEdgeIds(result.graphPatch.highlightEdgeIds);
  };

  if (!graph) {
    return (
      <GlassCard strong>
        <Skeleton active paragraph={{ rows: 12 }} />
      </GlassCard>
    );
  }

  return (
    <motion.div className="page-grid three" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <ScenarioSelector scenarios={scenarios} activeType={activeType} onSelect={selectScenario} />
      <GlassCard strong>
        <SectionHeader title="受影响语义路径" description="场景推演会高亮受影响节点、风险关系和证据路径。" />
        <SemanticWorldGraph
          nodes={graph.nodes}
          edges={graph.edges}
          dataStatus={graph.dataStatus}
          highlightNodeIds={highlightNodeIds}
          highlightEdgeIds={highlightEdgeIds}
        />
      </GlassCard>
      <ScenarioImpactPanel scenario={scenario} evidence={evidence} />
    </motion.div>
  );
}
