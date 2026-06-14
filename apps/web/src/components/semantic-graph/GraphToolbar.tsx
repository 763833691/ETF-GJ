import { Button, Tooltip } from 'antd';
import { Focus, Maximize2, RotateCcw, WandSparkles } from 'lucide-react';
import { filterOptions, type GraphFilter } from './graphTheme';

type GraphToolbarProps = {
  activeFilter: GraphFilter;
  onFilterChange: (filter: GraphFilter) => void;
  onResetView: () => void;
  onRelayout: () => void;
  onToggleFullscreen: () => void;
};

export function GraphToolbar({
  activeFilter,
  onFilterChange,
  onResetView,
  onRelayout,
  onToggleFullscreen,
}: GraphToolbarProps) {
  return (
    <div className="graph-toolbar">
      {filterOptions.map((option) => (
        <Button
          key={option.key}
          size="small"
          className={activeFilter === option.key ? 'active' : ''}
          onClick={() => onFilterChange(option.key)}
        >
          {option.label}
        </Button>
      ))}
      <Tooltip title="高亮方案路径">
        <Button
          size="small"
          icon={<Focus size={14} />}
          className={activeFilter === 'strategy' ? 'active' : ''}
          onClick={() => onFilterChange('strategy')}
        />
      </Tooltip>
      <Tooltip title="重置视图">
        <Button size="small" icon={<RotateCcw size={14} />} onClick={onResetView} />
      </Tooltip>
      <Tooltip title="自动整理节点">
        <Button size="small" icon={<WandSparkles size={14} />} onClick={onRelayout} />
      </Tooltip>
      <Tooltip title="全屏查看">
        <Button size="small" icon={<Maximize2 size={14} />} onClick={onToggleFullscreen} />
      </Tooltip>
    </div>
  );
}
