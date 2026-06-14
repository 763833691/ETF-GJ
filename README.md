# ETF 智能投教平台

数据驱动、语义驱动、证据闭环的 ETF 投教辅助与场景推演平台（第一阶段 Demo）。

## 功能概览

| 页面 | 说明 |
|------|------|
| `/` 主工作台 | 目标输入、用户画像、语义画布、AI 投教方案、新闻/风险/证据摘要 |
| `/scenario` 场景推演 | 场景切换、语义路径高亮、风险变化、证据来源 |
| `/report` 证据链报告 | 用户画像、语义世界、方案、场景、证据对象与免责声明 |
| `/system/swm` 语义世界调试台 | 只读对象、关系、动作、证据绑定 |
| `/system/status` 数据与模型状态 | 数据源、模型、接口和部署状态 |
| `/system/model` 模型配置 | 服务端代理配置、连接测试、启用真实模型 |

演示种子数据来自 `data/demoSeed.json`，标注 `dataSource = demo_seed`。点击「生成投资图谱」需配置大模型后才会生成真实语义节点，失败时会明确报错，不会静默降级为 Mock 数据。

## 环境要求

- Node.js >= 20
- pnpm >= 9

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制示例文件并按需修改：

```bash
cp .env.example .env
```

本地开发默认配置即可运行前端与 API；生成投资图谱需要配置大模型（见下文）。

### 3. 启动开发环境

同时启动前端和 API：

```bash
pnpm dev
```

分别启动：

```bash
pnpm --filter api dev
pnpm --filter web dev
```

默认地址：

```text
前端：http://127.0.0.1:5173
API： http://127.0.0.1:8000/api
```

本地开发时前端通过 Vite 代理访问 `/api`，无需单独配置跨域。

### 4. 配置大模型（生成投资图谱必需）

推荐在页面 **系统 → 模型配置**（`/system/model`）填写，开发环境默认允许运行时配置（`ALLOW_RUNTIME_MODEL_CONFIG=true`）。

**火山方舟 Doubao 示例：**

| 字段 | 值 |
|------|-----|
| Provider | `volcengine_ark` |
| API Mode | `responses` |
| Base URL | `https://ark.cn-beijing.volces.com/api/v3` |
| Model | `doubao-seed-2-0-pro-260215`（或你的接入点模型名） |
| API Key | 在[火山方舟控制台](https://console.volcengine.com/ark)获取 |

也可在 `.env` 中配置（生产环境推荐）：

```env
LLM_PROVIDER=volcengine_ark
LLM_API_MODE=responses
LLM_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
LLM_MODEL=doubao-seed-2-0-pro-260215
LLM_API_KEY=your_ark_api_key
LLM_ENABLED=true
ALLOW_RUNTIME_MODEL_CONFIG=false
```

API Key 保存在服务端 `data/runtime-model.local.json`（已加入 `.gitignore`），不会返回给前端。

配置完成后：点击「测试连接」验证 → 开启「启用真实模型」→ 回到主页输入投资目标 → 点击「生成投资图谱」。

## 构建与检查

```bash
pnpm build
pnpm typecheck
```

分别构建：

```bash
pnpm --filter api build
pnpm --filter web build
```

## 生产部署

部署路线：**Node.js + pnpm + PM2 + Nginx**（无 Docker）。

1. 上传代码到服务器（不要上传 `node_modules/`、`.env`、`data/runtime-model.local.json`）
2. 复制并编辑 `.env`，设置 `VITE_API_BASE_URL=/api`
3. 构建：`pnpm install --frozen-lockfile && pnpm build`
4. 启动 API：`pm2 start ecosystem.config.cjs`
5. 配置 Nginx 反向代理 `/api` → `127.0.0.1:8000`

参考文件：

- `.env.example` — 环境变量示例
- `ecosystem.config.cjs` — PM2 配置
- `nginx/etf-swm-agent.conf` — Nginx 示例
- `scripts/deploy.sh` — 服务器端一键部署脚本

生产构建时务必设置 `VITE_API_BASE_URL=/api`，否则前端会错误请求 `127.0.0.1:8000`。

## API 列表

```text
GET  /api/health
GET  /api/demo/bootstrap
GET  /api/semantic-world/graph
GET  /api/model/config
PUT  /api/model/config
POST /api/model/test
POST /api/workspace/generate
POST /api/profile/parse
POST /api/plan/generate
POST /api/scenario/simulate
GET  /api/report/demo
GET  /api/system/status
```

## 项目结构

```text
apps/
  api/          Express + TypeScript 后端
  web/          React + Vite 前端
data/
  demoSeed.json 演示种子数据
nginx/          Nginx 配置示例
scripts/        部署脚本
```

## 合规声明

本平台内容仅用于投资教育和辅助分析，不构成任何投资建议、收益承诺或交易指令。市场有风险，投资需谨慎。
