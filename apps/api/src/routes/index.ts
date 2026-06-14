import { Router } from 'express';
import { modelConfigUpdateSchema } from '../schemas/model.schema';
import { profileParseSchema } from '../schemas/profile.schema';
import { planGenerateSchema } from '../schemas/plan.schema';
import { scenarioSimulateSchema } from '../schemas/scenario.schema';
import { workspaceGenerateSchema } from '../schemas/workspace.schema';
import {
  generatePlan,
  getBootstrap,
  getHealth,
  getModelGenerationContext,
  getReport,
  getSemanticGraph,
  getSystemStatus,
  parseProfile,
  simulateScenario,
} from '../services/demoSeed.service';
import { generateWorkspaceWithModel, testModelConnection } from '../services/llm.service';
import {
  getPublicModelConfig,
  updateModelConfig,
} from '../services/modelConfig.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, getHealth());
});

apiRouter.get('/demo/bootstrap', (_req, res) => {
  sendSuccess(res, getBootstrap());
});

apiRouter.get('/semantic-world/graph', (_req, res) => {
  sendSuccess(res, getSemanticGraph());
});

apiRouter.get('/model/config', (_req, res) => {
  sendSuccess(res, getPublicModelConfig(), { dataSource: 'system_generated' });
});

apiRouter.put(
  '/model/config',
  asyncHandler(async (req, res) => {
    const input = modelConfigUpdateSchema.parse(req.body);
    sendSuccess(res, updateModelConfig(input), { dataSource: 'system_generated' });
  }),
);

apiRouter.post(
  '/model/test',
  asyncHandler(async (_req, res) => {
    sendSuccess(res, await testModelConnection(), { dataSource: 'model_generated' });
  }),
);

apiRouter.post(
  '/workspace/generate',
  asyncHandler(async (req, res) => {
    const input = workspaceGenerateSchema.parse(req.body);
    const result = await generateWorkspaceWithModel(input, getModelGenerationContext());
    sendSuccess(res, result, { dataSource: 'model_generated' });
  }),
);

apiRouter.post(
  '/profile/parse',
  asyncHandler(async (req, res) => {
    const input = profileParseSchema.parse(req.body);
    sendSuccess(res, parseProfile(input));
  }),
);

apiRouter.post(
  '/plan/generate',
  asyncHandler(async (req, res) => {
    const input = planGenerateSchema.parse(req.body);
    sendSuccess(res, generatePlan(input.useModel));
  }),
);

apiRouter.post(
  '/scenario/simulate',
  asyncHandler(async (req, res) => {
    const input = scenarioSimulateSchema.parse(req.body);
    sendSuccess(res, simulateScenario(input.scenarioType));
  }),
);

apiRouter.get('/report/demo', (_req, res) => {
  sendSuccess(res, getReport());
});

apiRouter.get('/system/status', (_req, res) => {
  sendSuccess(res, getSystemStatus());
});
