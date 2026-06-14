export const TOUR_SKIPPED_STORAGE_KEY = 'etf-platform-tour-skipped';
export const TOUR_STEP_ENTER_EVENT = 'etf-tour-step-enter';

export type TourPrepareAction = 'open-input-panel' | 'open-plan-panel' | 'close-panels';

export type TourStep = {
  id: string;
  route?: string;
  target?: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  prepare?: TourPrepareAction;
};

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    placement: 'center',
    title: '欢迎使用 ETF 智能投教平台',
    content:
      '本平台通过投资图谱、AI 投教方案和证据链，帮助你理解 ETF 配置逻辑与风险。接下来用 6 步快速了解核心操作流程。',
  },
  {
    id: 'model-config',
    route: '/system/model',
    target: '[data-tour="nav-model"]',
    placement: 'bottom',
    title: '第 1 步：配置真实模型',
    content:
      '首次使用请进入「模型配置」，选择火山方舟 Doubao，填入 API Key 并开启「启用真实模型」，保存后可测试连接。',
  },
  {
    id: 'workspace',
    route: '/',
    target: '[data-tour="nav-workspace"]',
    placement: 'bottom',
    title: '第 2 步：进入主工作台',
    content: '回到「工作台」，在这里输入你的投资目标，并生成个性化投资图谱与投教方案。',
    prepare: 'close-panels',
  },
  {
    id: 'goal-panel',
    route: '/',
    target: '[data-tour="panel-input"]',
    placement: 'right',
    title: '第 3 步：填写目标与画像',
    content: '点击左侧「目标与画像」，填写定投金额、周期、风险偏好和关注主题，让 AI 理解你的学习需求。',
    prepare: 'open-input-panel',
  },
  {
    id: 'generate-graph',
    route: '/',
    target: '[data-tour="generate-graph"]',
    placement: 'top',
    title: '第 4 步：生成投资图谱',
    content:
      '模型配置完成后，点击「生成投资图谱」。系统会调用大模型分析你的输入，并生成可视化节点与关系。',
    prepare: 'open-input-panel',
  },
  {
    id: 'graph-canvas',
    route: '/',
    target: '[data-tour="graph-canvas"]',
    placement: 'left',
    title: '第 5 步：查看投资图谱',
    content:
      '中间画布展示投资图谱，可缩放、拖拽和筛选节点类型。点击节点可查看详情，理解目标、风险与方案之间的关联。',
    prepare: 'close-panels',
  },
  {
    id: 'ai-plan',
    route: '/',
    target: '[data-tour="panel-plan"]',
    placement: 'left',
    title: '第 6 步：阅读 AI 投教方案',
    content:
      '点击右侧「AI 投教方案」查看模型生成的学习路径、适用人群与风险提示。也可前往「场景推演」和「证据报告」继续探索。',
    prepare: 'open-plan-panel',
  },
];
