# 03-ETF智能投教平台_UI视觉规范与组件系统_v0.1

> 项目名称：ETF 智能投教平台  
> 文档类型：UI 视觉规范 / 组件系统 / 前端实现约束  
> 版本：v0.1  
> 阶段：竞赛 Demo P0 / 产品雏形  
> 重要约束：本项目第一阶段不使用 Docker。前端开发、后端运行与服务器部署均按本地 Node.js / Nginx / PM2 / 原生 PostgreSQL 路线准备。本文档不包含任何 Docker、Docker Compose、容器化部署要求。

---

## 0. 文档目标

本文档用于指导 Codex / Cursor / 前端开发者完成 ETF 智能投教平台的 UI 视觉规范与组件系统设计。

本平台虽然是竞赛 Demo，但视觉和交互必须按照“专业金融科技产品雏形”完成，不能做成临时演示页、普通后台页或粗糙可视化页。

核心目标：

```text
速度是 Demo 级
界面是产品级
结构是可扩展级
表达是竞赛演示级
```

本阶段最重要的前端效果：

```text
1. 打开即用，无登录页。
2. 第一屏即进入 ETF 智能投教工作台。
3. 中间画布具备高级、低饱和、液态玻璃质感。
4. React Flow 语义节点不能使用过艳颜色。
5. 画布体现“数据驱动 + 语义驱动 + 证据闭环”。
6. AI 方案卡片和证据链区域必须专业、克制、可信。
7. 所有投教内容必须有合规免责声明。
```

---

## 1. 产品视觉定位

ETF 智能投教平台的视觉方向是：

```text
专业金融科技 SaaS
+ AI 智能工作台
+ 数据驱动语义画布
+ 液态玻璃质感
+ 低饱和高级配色
+ 可解释证据链
```

它不应该像：

```text
普通基金列表页
普通后台管理系统
廉价蓝紫大屏
黑红股票交易软件
艳色知识图谱 Demo
临时比赛展示网页
```

它应该像：

```text
高端金融分析工作台
AI Copilot 决策辅助界面
现代 SaaS 控制台
可视化语义世界模型界面
```

最终给人的第一感受应是：

```text
可信
专业
清爽
克制
高级
智能
数据驱动
可解释
```

---

## 2. 视觉设计原则

### 2.1 克制优先

金融类产品不适合过度炫技。颜色、动效、图谱节点都必须克制。

要求：

```text
少用高饱和颜色
少用大面积渐变
少用霓虹发光
少用强烈投影
少用红绿涨跌刺激视觉
```

推荐：

```text
低饱和蓝灰
淡青蓝
雾紫灰
浅金灰
白色半透明玻璃
柔和阴影
细边框
```

---

### 2.2 数据可信感

界面必须反复强化“数据来源、更新时间、证据链、风险提示”。

因此所有关键模块都应该有：

```text
data_source
updated_at
confidence
risk_level
evidence_count
status
```

界面上应明显显示：

```text
当前数据源：demo_seed / provider_api
当前模型状态：已配置 / 未配置
当前内容：投教辅助，不构成投资建议
```

---

### 2.3 语义驱动感

中间画布不能只是节点连线，而要体现：

```text
数据 → 对象
对象 → 关系
关系 → 风险
风险 → 方案
方案 → 证据
```

因此画布中应存在这些视觉层级：

```text
用户目标层
ETF 资产层
指数与行业层
新闻事件层
风险信号层
证据链层
方案路径层
```

---

### 2.4 液态玻璃但不花哨

液态玻璃效果用于增强“高级 SaaS”感，但不能喧宾夺主。

使用位置：

```text
主容器背景
顶部状态栏
中间画布卡片
语义节点
AI 方案卡片
数据状态卡
证据摘要卡
详情抽屉
```

避免：

```text
每个小按钮都玻璃化
过高透明度导致看不清
过度模糊导致性能下降
大面积发光边框
```

---

## 3. 全局页面基调

### 3.1 背景

推荐整体背景：

```css
body {
  background:
    radial-gradient(circle at top left, rgba(87, 137, 255, 0.12), transparent 32%),
    radial-gradient(circle at top right, rgba(72, 211, 196, 0.10), transparent 30%),
    linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%);
}
```

页面背景要有轻微层次，但不能像科技展板。

背景关键词：

```text
浅色
清爽
柔和
低对比
有空气感
```

---

### 3.2 页面最大宽度

桌面端优先，适合竞赛现场演示。

建议：

```text
最小适配宽度：1366px
推荐演示宽度：1440px / 1536px / 1920px
主工作台高度：100vh
```

移动端第一阶段不作为重点，只需保证不崩溃。

---

### 3.3 布局模式

全局布局采用：

```text
顶部状态导航栏
+ 主内容工作区
```

主工作台采用：

```text
左侧用户目标面板
+ 中间语义世界画布
+ 右侧 AI 方案与证据面板
+ 底部数据事件摘要
```

---

## 4. 色彩系统

### 4.1 主色

主色使用低饱和金融蓝。

```css
--color-primary-900: #10233f;
--color-primary-800: #18365d;
--color-primary-700: #24517e;
--color-primary-600: #326ea6;
--color-primary-500: #4a8bcc;
--color-primary-100: #e7f0fb;
```

使用场景：

```text
主按钮
顶部导航当前项
核心路径边
重要状态
```

---

### 4.2 辅助色

辅助色控制在低饱和范围。

```css
--color-cyan-soft: #6bbfc4;
--color-mint-soft: #8fcfbd;
--color-indigo-soft: #7f92c8;
--color-purple-soft: #a99bc8;
--color-gold-soft: #c8ae72;
--color-orange-soft: #d9a36f;
```

用途：

```text
青蓝：数据 / 指数 / 市场指标
雾紫：AI / 语义分析 / 模型生成
浅金：证据 / 投教规则 / 引用来源
柔橙：风险提示 / 需重新评估
薄绿：稳健 / 已同步 / 低风险
```

---

### 4.3 中性色

```css
--color-bg: #f6f8fc;
--color-surface: rgba(255, 255, 255, 0.72);
--color-surface-solid: #ffffff;
--color-border: rgba(120, 146, 180, 0.22);
--color-border-strong: rgba(80, 110, 150, 0.32);
--color-text-main: #142033;
--color-text-secondary: #526173;
--color-text-tertiary: #7b8794;
--color-muted: #a5afbd;
```

---

### 4.4 禁用颜色风格

禁止使用以下风格作为主视觉：

```text
高饱和纯蓝 #0000ff
高饱和紫色 #8a00ff
大面积荧光绿
大面积股票红
大面积黑底霓虹
彩虹图谱节点
红绿强刺激涨跌界面
```

---

## 5. 字体与排版

### 5.1 字体

前端使用系统字体：

```css
font-family: Inter, Geist, -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang SC", "Microsoft YaHei", sans-serif;
```

说明：

```text
不强依赖外部字体文件
不引入字体版权风险
中英文和数字显示稳定
```

---

### 5.2 字号

```css
--font-size-xs: 12px;
--font-size-sm: 13px;
--font-size-base: 14px;
--font-size-md: 15px;
--font-size-lg: 18px;
--font-size-xl: 22px;
--font-size-2xl: 28px;
```

推荐使用：

```text
顶部标题：18-22px
模块标题：15-18px
正文：13-14px
标签：12px
数据数字：18-28px
```

---

### 5.3 字重

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

金融产品中不要到处使用粗体。标题和关键数据使用 600，正文使用 400。

---

## 6. 间距与圆角

### 6.1 间距

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

### 6.2 圆角

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 28px;
```

使用建议：

```text
按钮：10-12px
普通卡片：16px
主工作区：24px
语义节点：16-18px
详情抽屉：20px
```

---

## 7. 阴影与液态玻璃效果

### 7.1 基础阴影

```css
--shadow-soft: 0 12px 32px rgba(32, 68, 120, 0.10);
--shadow-card: 0 16px 42px rgba(32, 68, 120, 0.12);
--shadow-floating: 0 24px 60px rgba(32, 68, 120, 0.16);
```

---

### 7.2 液态玻璃卡片

通用玻璃卡片样式：

```css
.glass-card {
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(120, 146, 180, 0.22);
  box-shadow: 0 16px 42px rgba(32, 68, 120, 0.12);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border-radius: 20px;
}
```

---

### 7.3 强调玻璃卡片

用于中间语义画布和 AI 方案区域：

```css
.glass-card-strong {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.78),
    rgba(245, 249, 255, 0.58)
  );
  border: 1px solid rgba(106, 136, 180, 0.28);
  box-shadow:
    0 18px 48px rgba(32, 68, 120, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(22px) saturate(1.25);
  -webkit-backdrop-filter: blur(22px) saturate(1.25);
  border-radius: 24px;
}
```

---

## 8. 全局组件系统

前端组件分为 8 组：

```text
1. Layout Components      布局组件
2. Input Components       输入组件
3. Semantic Graph         语义画布组件
4. Plan Components        方案组件
5. Scenario Components    场景推演组件
6. Evidence Components    证据链组件
7. System Components      系统状态组件
8. Motion Components      动效组件
```

---

## 9. Layout Components 布局组件

### 9.1 AppShell

全局应用容器。

职责：

```text
渲染顶部导航
渲染主内容区
控制全局背景
显示合规提示
处理路由内容
```

建议文件：

```text
components/layout/AppShell.tsx
```

---

### 9.2 TopNav

顶部导航栏。

内容：

```text
左侧：产品名称 ETF 智能投教平台
中部：工作台 / 场景推演 / 证据报告 / 系统状态
右侧：数据源状态 / 模型状态 / 导出报告
```

视觉要求：

```text
半透明玻璃背景
高度 64px
固定顶部
细边框底线
状态标签低饱和
```

---

### 9.3 WorkspaceLayout

主工作台三栏布局。

结构：

```text
左侧 300-340px：用户目标与画像
中间 flex：语义世界画布
右侧 360-420px：AI 投教方案与证据摘要
底部区域：新闻事件 / 风险信号 / 数据摘要
```

注意：

```text
中间画布必须是视觉核心
左右面板不能抢主视觉
整体不要拥挤
```

---

## 10. Input Components 输入组件

### 10.1 GoalBriefCard

用户目标输入卡片。

包含：

```text
自然语言输入框
投资周期选择
每月预算输入
风险偏好选择
投资经验选择
主题偏好标签
生成按钮
```

默认示例：

```text
我每月想定投 1000 元，投资周期 3 年，风险偏好中等，想了解宽基、红利和科技 ETF。
```

视觉要求：

```text
玻璃卡片
输入框简洁
按钮为主色渐变但低饱和
```

---

### 10.2 InvestorProfileCard

用户画像卡片。

展示：

```text
投资目标
风险偏好
投资周期
知识水平
主题偏好
方案目标
```

状态：

```text
未生成
已生成
需补充信息
```

---

### 10.3 RiskPreferenceSelector

风险偏好选择器。

选项：

```text
保守
稳健
均衡
成长
进取
```

视觉要求：

```text
使用低饱和标签
选中项使用柔和蓝色描边
不要用强红强绿
```

---

## 11. Semantic Graph 语义画布组件

中间画布是整个平台的核心视觉和概念表达。

使用：

```text
@xyflow/react
```

组件命名必须通用，不要写死为 ETFGraph。

目录：

```text
components/semantic-graph/
  SemanticWorldGraph.tsx
  SemanticNode.tsx
  SemanticEdge.tsx
  GraphToolbar.tsx
  NodeDetailDrawer.tsx
  EvidenceTracePanel.tsx
  ActionTracePanel.tsx
  graphTheme.ts
  graphDataAdapter.ts
```

---

### 11.1 SemanticWorldGraph

职责：

```text
接收 nodes / edges
渲染 React Flow 画布
显示数据源状态条
显示图谱工具栏
支持节点点击
支持关系点击
支持路径高亮
支持类型筛选
```

要求：

```text
默认 fitView
节点布局固定可控
第一版不强制自动布局
支持背景网格但必须非常浅
```

---

### 11.2 SemanticNode

通用节点组件。

节点数据：

```ts
type SemanticNodeData = {
  objectType: string;
  title: string;
  subtitle?: string;
  status?: 'active' | 'draft' | 'pending_review' | 'warning' | 'approved';
  source?: 'demo_seed' | 'provider_api' | 'model_generated' | 'manual';
  confidence?: number;
  updatedAt?: string;
  riskLevel?: 'low' | 'medium' | 'high';
};
```

节点必须展示：

```text
对象类型小标签
标题
副标题
状态点
数据来源标识
```

---

### 11.3 节点分类视觉

节点分类使用低饱和颜色，不使用大面积艳色。

#### 用户类节点

```text
UserProfile
InvestmentGoal
RiskProfile
```

颜色：低饱和蓝灰。

```css
--node-user-bg: rgba(235, 242, 252, 0.72);
--node-user-border: rgba(74, 139, 204, 0.28);
```

#### 资产类节点

```text
ETFProduct
Index
FundCompany
Holding
Sector
Theme
```

颜色：淡青蓝。

```css
--node-asset-bg: rgba(231, 246, 248, 0.72);
--node-asset-border: rgba(107, 191, 196, 0.30);
```

#### 数据类节点

```text
MarketMetric
PerformanceMetric
LiquidityMetric
VolatilityMetric
```

颜色：浅蓝白。

```css
--node-data-bg: rgba(238, 245, 255, 0.72);
--node-data-border: rgba(126, 160, 210, 0.28);
```

#### 事件类节点

```text
NewsEvent
PolicyEvent
MarketEvent
RiskEvent
Announcement
```

颜色：浅金橙，但极低饱和。

```css
--node-event-bg: rgba(255, 249, 235, 0.74);
--node-event-border: rgba(200, 174, 114, 0.32);
```

#### 风险类节点

```text
RiskFactor
RiskSignal
```

颜色：柔橙，不要红色。

```css
--node-risk-bg: rgba(255, 244, 235, 0.74);
--node-risk-border: rgba(217, 163, 111, 0.34);
```

#### 证据类节点

```text
EvidenceObject
DataSource
Citation
```

颜色：浅金灰。

```css
--node-evidence-bg: rgba(250, 247, 239, 0.74);
--node-evidence-border: rgba(190, 166, 110, 0.34);
```

#### 方案类节点

```text
StrategyPlan
ScenarioRun
```

颜色：雾紫蓝。

```css
--node-plan-bg: rgba(242, 240, 250, 0.74);
--node-plan-border: rgba(127, 146, 200, 0.32);
```

---

### 11.4 节点样式

```css
.semantic-node {
  min-width: 152px;
  max-width: 220px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(120, 146, 180, 0.24);
  box-shadow: 0 12px 32px rgba(32, 68, 120, 0.10);
  backdrop-filter: blur(18px) saturate(1.18);
  -webkit-backdrop-filter: blur(18px) saturate(1.18);
}

.semantic-node:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 44px rgba(32, 68, 120, 0.14);
  border-color: rgba(74, 139, 204, 0.32);
}
```

禁止：

```text
纯色大色块节点
红蓝紫绿高饱和节点
强发光节点
黑底霓虹节点
```

---

### 11.5 SemanticEdge

边样式：

```css
.semantic-edge {
  stroke: rgba(86, 116, 160, 0.34);
  stroke-width: 1.2;
}

.semantic-edge-core {
  stroke: rgba(74, 139, 204, 0.58);
  stroke-width: 1.8;
}

.semantic-edge-risk {
  stroke: rgba(217, 163, 111, 0.52);
  stroke-width: 1.6;
}
```

要求：

```text
默认边低对比
核心路径略高亮
风险路径用柔橙
证据路径用浅金
不要全图彩虹线
```

---

### 11.6 GraphToolbar

画布工具栏。

按钮：

```text
全部
用户目标
ETF 数据
新闻事件
风险信号
证据链
方案路径
重置视图
全屏
```

视觉：

```text
悬浮玻璃胶囊
按钮低饱和
选中项浅蓝底
```

---

### 11.7 DataSourceStatusBar

画布顶部数据状态条。

展示：

```text
数据源：demo_seed
ETF 数据：已载入
新闻事件：8 条
风险信号：3 条
证据对象：12 条
最近更新：演示时间
```

后续真实数据接入后展示：

```text
数据源：provider_api
ETF 数据更新时间：xxxx
新闻更新时间：xxxx
指数数据更新时间：xxxx
```

---

### 11.8 NodeDetailDrawer

点击节点打开右侧详情抽屉。

内容：

```text
对象名称
对象类型
对象状态
数据来源
更新时间
语义解释
关联对象
关联证据
风险提示
最近动作
是否用于方案生成
```

视觉：

```text
右侧抽屉
玻璃背景
信息分组
证据和风险使用标签
```

---

## 12. Plan Components 方案组件

### 12.1 StrategyPlanCard

AI 投教辅助方案卡片。

内容：

```text
方案名称
匹配度
组合逻辑
适合人群
核心 ETF 类型
主要风险
证据来源
免责声明
```

方案示例：

```text
稳健学习型方案
成长关注型方案
低波动定投型方案
```

注意：

```text
不能写“建议买入”
不能写“预期收益”
不能写“稳赚”
不能输出交易指令
```

统一用语：

```text
投教辅助方案
用于理解 ETF 类型和风险结构
需要用户自行判断
不构成投资建议
```

---

### 12.2 MatchScoreBadge

匹配度标签。

不要做成“推荐指数”。

推荐文案：

```text
目标匹配度
风险适配度
学习适配度
```

颜色：

```text
低饱和蓝 / 青 / 金
```

---

### 12.3 RiskTag

风险标签。

示例：

```text
波动风险
行业集中风险
流动性风险
跟踪误差风险
溢价风险
信息滞后风险
```

颜色：柔橙或灰橙，不使用强红。

---

### 12.4 EvidenceTag

证据标签。

示例：

```text
ETF 基础数据
指数说明
投教规则
新闻事件
风险信号
```

颜色：浅金灰。

---

## 13. Scenario Components 场景推演组件

### 13.1 ScenarioButtonGroup

场景按钮：

```text
市场震荡
科技板块回撤
红利风格走强
投资周期缩短
风险偏好下降
流动性下降
新闻负面事件
政策变化
```

点击后更新：

```text
受影响节点
受影响路径
风险信号
方案稳定性
重新评估提示
```

---

### 13.2 ScenarioImpactPanel

展示场景推演结果。

包含：

```text
场景摘要
影响路径
风险变化
证据来源
重新评估建议
```

合规表达：

```text
建议重新评估风险承受能力
建议关注相关风险因素
建议结合自身情况判断
```

禁止表达：

```text
建议卖出
建议买入
立即调仓
一定上涨
一定下跌
```

---

### 13.3 ScenarioMiniChart

场景推演可以使用 ECharts 展示简单风险变化。

图表类型：

```text
风险权重条形图
方案稳定性雷达图
新闻事件时间线
```

第一版不需要复杂量化图。

---

## 14. Evidence Components 证据链组件

### 14.1 EvidenceSummaryCard

证据摘要卡。

展示：

```text
证据对象数
投教规则数
新闻事件数
数据源数
待复核数
```

---

### 14.2 EvidenceList

证据列表。

字段：

```text
证据标题
证据类型
数据来源
更新时间
关联对象
是否用于方案
状态
```

状态：

```text
demo_seed
pending_review
approved
provider_api
```

---

### 14.3 EvidenceTracePanel

证据追溯面板。

内容：

```text
原始数据来源
标准化字段
语义解释
关联节点
用于哪个方案
风险提示
```

第一版 demo_seed 可展示演示来源。

---

## 15. System Components 系统状态组件

### 15.1 SystemStatusCard

展示系统状态。

内容：

```text
数据源状态
模型状态
API 状态
图谱构建状态
报告生成状态
```

---

### 15.2 ModelStatusBadge

模型状态：

```text
已配置
未配置
演示模式
调用失败
```

未配置时前端提示：

```text
当前未配置真实模型，页面展示演示数据。正式部署后可通过服务端环境变量配置模型服务。
```

不能出现 API Key 明文。

---

### 15.3 DataSourceBadge

数据源状态：

```text
demo_seed
provider_api
manual_import
cached
```

第一版默认：

```text
demo_seed
```

---

## 16. Motion Components 动效规范

使用：

```text
Framer Motion
```

可用动效：

```text
页面淡入
卡片轻微上浮
图谱节点 hover
抽屉滑入
方案卡片生成时淡入
场景推演结果切换
```

禁止：

```text
大幅度旋转
过度弹跳
频繁闪烁
强烈粒子动画
强霓虹扫描线
```

动效原则：

```text
辅助理解，不抢内容
让界面更高级，不让界面更吵
```

---

## 17. Ant Design 使用规范

允许使用 Ant Design 的：

```text
Button
Input
Select
Slider
Segmented
Tabs
Card
Tag
Badge
Drawer
Table
Tooltip
Progress
Alert
Statistic
```

但不能直接使用默认 Ant Design 形成“普通后台感”。

需要通过 CSS 覆盖：

```text
圆角
边框
背景
按钮颜色
卡片阴影
Tabs 样式
```

Ant Design 组件应作为基础组件，最终视觉由本项目 Design System 统一包装。

建议封装：

```text
GlassCard
SoftButton
StatusBadge
RiskTag
EvidenceTag
SectionHeader
```

---

## 18. 页面级视觉要求

### 18.1 主工作台

主工作台必须是第一版最精致页面。

第一屏结构：

```text
顶部状态导航
左侧目标输入
中间语义世界画布
右侧 AI 方案
底部数据事件摘要
```

视觉重点：

```text
中间画布最大
左右辅助面板清晰
整体像专业金融 SaaS
```

---

### 18.2 场景推演页

场景推演页风格：

```text
上方场景选择
中间影响路径
右侧风险变化
下方解释文本和证据
```

要体现“世界状态变化 → 方案重新解释”。

---

### 18.3 证据链报告页

报告页要有正式报告感。

结构：

```text
报告封面卡
用户画像摘要
语义世界摘要
方案摘要
场景推演摘要
证据对象列表
风险提示
免责声明
```

第一版可做 HTML 报告，不强制 PDF。

---

### 18.4 SWM 调试台

SWM 调试台只读，不做复杂编辑。

内容：

```text
对象列表
关系列表
动作日志
证据绑定
```

视觉可以偏开发者，但仍保持产品统一风格。

---

### 18.5 系统状态页

系统状态页只读。

显示：

```text
数据源状态
模型状态
API 状态
真实接口接入状态
demo_seed 说明
```

无登录阶段，禁止提供：

```text
API Key 编辑
删除数据
修改系统配置
用户管理
权限管理
```

---

## 19. 合规视觉要求

所有涉及方案、报告、推演的区域必须出现免责声明。

统一文案：

```text
本平台内容仅用于投资教育和辅助分析，不构成任何投资建议、收益承诺或交易指令。市场有风险，投资需谨慎。
```

展示位置：

```text
顶部状态栏小提示
AI 方案卡片底部
场景推演结果底部
证据链报告底部
导出报告中
```

---

## 20. 无 Docker 开发约束

本项目第一阶段不使用 Docker。

前端开发文档、启动脚本和部署说明不得要求：

```text
Docker
Docker Compose
Dockerfile
容器网络
容器卷挂载
容器化 PostgreSQL
```

本地开发使用：

```text
Node.js
pnpm
Vite dev server
```

服务器部署使用：

```text
Nginx
PM2
Node.js
原生 PostgreSQL
systemctl 可选
```

UI 文档中如涉及系统状态，不出现 Docker 状态项。

系统状态页可显示：

```text
Frontend: static build
API: PM2 process
Database: PostgreSQL native service
Nginx: active
```

---

## 21. 前端文件建议

目录：

```text
apps/web/src/
  app/
    App.tsx
    routes.tsx
  pages/
    WorkspacePage.tsx
    ScenarioPage.tsx
    ReportPage.tsx
    SwmDebugPage.tsx
    SystemStatusPage.tsx
  components/
    layout/
      AppShell.tsx
      TopNav.tsx
      WorkspaceLayout.tsx
    workspace/
      GoalBriefCard.tsx
      InvestorProfileCard.tsx
      StrategyPlanCard.tsx
      DataEventStrip.tsx
    semantic-graph/
      SemanticWorldGraph.tsx
      SemanticNode.tsx
      SemanticEdge.tsx
      GraphToolbar.tsx
      NodeDetailDrawer.tsx
      graphTheme.ts
      graphDataAdapter.ts
    scenario/
      ScenarioButtonGroup.tsx
      ScenarioImpactPanel.tsx
      ScenarioMiniChart.tsx
    report/
      ReportPreview.tsx
      EvidenceList.tsx
      DisclaimerBlock.tsx
    system/
      SystemStatusCard.tsx
      ModelStatusBadge.tsx
      DataSourceBadge.tsx
    common/
      GlassCard.tsx
      SoftButton.tsx
      StatusBadge.tsx
      SectionHeader.tsx
  data/
    demoSeed.ts
  services/
    api.ts
  styles/
    theme.css
    glass.css
    graph.css
```

---

## 22. 第一阶段 UI 验收标准

### 22.1 整体观感

必须满足：

```text
页面不像临时 Demo
页面不像默认后台模板
页面有专业金融科技 SaaS 质感
节点颜色低饱和且高级
液态玻璃效果克制清晰
```

---

### 22.2 主工作台

必须满足：

```text
打开 / 直接进入主工作台
不出现登录页
不出现注册页
中间图谱清晰可见
左侧可以输入用户目标
右侧可以看到 AI 方案卡片
顶部可以看到数据源和模型状态
```

---

### 22.3 语义画布

必须满足：

```text
使用 React Flow
至少展示 15 个语义节点
至少展示 20 条语义关系
节点可以点击
点击后打开详情抽屉
可以筛选节点类型
可以高亮方案路径
```

---

### 22.4 数据驱动表达

必须满足：

```text
画布中有 ETF 数据节点
画布中有新闻事件节点
画布中有风险信号节点
画布中有证据对象节点
顶部显示数据源状态
明确标记 demo_seed
```

---

### 22.5 合规表达

必须满足：

```text
AI 方案区域显示免责声明
场景推演区域显示免责声明
报告页显示免责声明
不出现买入/卖出/收益承诺
```

---

## 23. 给 Codex 的 UI 开发约束摘要

可直接复制给 Codex：

```text
请严格按照 03-ETF智能投教平台_UI视觉规范与组件系统_v0_1.md 开发前端 UI。

本项目第一阶段不使用 Docker。不要生成 Dockerfile、docker-compose.yml 或任何容器化运行说明。

视觉风格必须是专业金融科技 SaaS + 液态玻璃 + 低饱和蓝灰，不要使用艳色节点、黑红大屏、霓虹风或普通后台默认风格。

中间画布使用 @xyflow/react 实现，组件命名为 SemanticWorldGraph，不要命名为 ETFGraph，以便后续扩展为通用 SWM 语义画布。

节点必须使用低饱和半透明玻璃样式。边线必须低对比，只有核心路径和风险路径轻微高亮。

页面打开后直接进入主工作台，不做登录页、注册页、用户中心。

第一版可以使用 demoSeed.ts 数据，但所有数据必须标记 data_source = demo_seed，并在页面显示“当前使用演示数据”。

必须包含合规免责声明：本平台内容仅用于投资教育和辅助分析，不构成任何投资建议、收益承诺或交易指令。市场有风险，投资需谨慎。
```

---

## 24. 结论

本 UI 规范的核心是：

```text
专业，而不是炫技。
高级，而不是艳丽。
可信，而不是刺激交易。
数据驱动，而不是静态摆图。
语义驱动，而不是普通关系图。
Demo 速度，但产品质感。
```

第一阶段只要严格按本文档执行，ETF 智能投教平台就可以在竞赛演示中呈现为一个有明确产品气质、技术路线和后续扩展能力的专业金融科技 Demo。
