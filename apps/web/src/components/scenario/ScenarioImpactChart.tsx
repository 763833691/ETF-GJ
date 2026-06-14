import ReactECharts from 'echarts-for-react';
import type { ScenarioResult } from '../../types/domain';

type ScenarioImpactChartProps = {
  scenario: ScenarioResult;
};

export function ScenarioImpactChart({ scenario }: ScenarioImpactChartProps) {
  const option = {
    color: ['#7f92c8', '#d9a36f'],
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 8, top: 24, bottom: 10, containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { color: '#7b8794' }, splitLine: { lineStyle: { color: 'rgba(120,146,180,0.16)' } } },
    yAxis: {
      type: 'category',
      data: scenario.riskChanges.map((item) => item.name),
      axisLabel: { color: '#526173' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: '场景前',
        type: 'bar',
        data: scenario.riskChanges.map((item) => item.before),
        barWidth: 9,
        itemStyle: { borderRadius: [6, 6, 6, 6] },
      },
      {
        name: '场景后',
        type: 'bar',
        data: scenario.riskChanges.map((item) => item.after),
        barWidth: 9,
        itemStyle: { borderRadius: [6, 6, 6, 6] },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 220, width: '100%' }} />;
}
