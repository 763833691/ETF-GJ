import {
  DISCLAIMER,
  demoSeed,
  getLocalBootstrap,
  getLocalGraph,
  getLocalReport,
  getLocalScenario,
  getLocalSystemStatus,
} from '../data/demoSeed';
import type {
  BootstrapData,
  InvestorProfile,
  ModelConfig,
  SemanticGraphResponse,
  StrategyPlan,
  WorkspaceGenerationResponse,
} from '../types/domain';

type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
      meta: { requestId: string; dataSource: string; timestamp: string };
    }
  | {
      success: false;
      error: { code: string; message: string; details?: unknown };
      meta: { requestId: string; timestamp: string };
    };

const trimSlash = (value: string) => value.replace(/\/$/, '');

export const API_BASE_URL = trimSlash(import.meta.env.VITE_API_BASE_URL || '/api');

export type WorkspaceGenerateInput = {
  naturalLanguageGoal: string;
  riskPreference: string;
  monthlyBudget: number;
  investmentHorizon: string;
  themePreferences: string[];
  experienceLevel: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    const message = payload.success ? `API request failed: ${response.status}` : payload.error.message;
    const error = new Error(message);
    (error as Error & { code?: string; status?: number }).code = payload.success ? 'api_error' : payload.error.code;
    (error as Error & { code?: string; status?: number }).status = response.status;
    throw error;
  }

  return payload.data;
}

export const api = {
  async getBootstrap(): Promise<BootstrapData> {
    try {
      return await request<BootstrapData>('/demo/bootstrap');
    } catch {
      return getLocalBootstrap();
    }
  },

  async getSemanticGraph(): Promise<SemanticGraphResponse> {
    try {
      return await request<SemanticGraphResponse>('/semantic-world/graph');
    } catch {
      return getLocalGraph();
    }
  },

  async parseProfile(input: {
    naturalLanguageGoal: string;
    riskPreference: string;
    monthlyBudget: number;
    investmentHorizon: string;
    themePreferences: string[];
    experienceLevel: string;
  }): Promise<{ profile: InvestorProfile; semanticObjectsCreated: string[] }> {
    try {
      return await request('/profile/parse', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch {
      return {
        profile: {
          ...(demoSeed.profile as InvestorProfile),
          naturalLanguageGoal: input.naturalLanguageGoal,
          monthlyBudget: input.monthlyBudget,
          timeHorizon: input.investmentHorizon,
          themePreferences: input.themePreferences,
          riskPreference: input.riskPreference,
          experienceLevel: input.experienceLevel,
          dataSource: 'demo_seed',
        } as InvestorProfile,
        semanticObjectsCreated: ['profile_demo_001', 'goal_demo_001', 'risk_profile_demo_001'],
      };
    }
  },

  async generateWorkspace(input: WorkspaceGenerateInput): Promise<WorkspaceGenerationResponse> {
    return request('/workspace/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async generatePlan(goalText: string): Promise<{ plans: StrategyPlan[]; model: { status: string } }> {
    try {
      return await request('/plan/generate', {
        method: 'POST',
        body: JSON.stringify({ goalText, useModel: true }),
      });
    } catch {
      return {
        plans: (demoSeed.strategyPlans as StrategyPlan[]).map((plan) => ({
          ...plan,
          disclaimer: DISCLAIMER,
          dataSource: 'demo_seed',
        })),
        model: { status: 'not_configured' },
      };
    }
  },

  async simulateScenario(scenarioType: string) {
    try {
      return await request('/scenario/simulate', {
        method: 'POST',
        body: JSON.stringify({ scenarioType, profileId: 'profile_demo_001', planId: 'plan_demo_001' }),
      });
    } catch {
      return getLocalScenario(scenarioType);
    }
  },

  async getReport() {
    try {
      return await request('/report/demo');
    } catch {
      return getLocalReport();
    }
  },

  async getSystemStatus() {
    try {
      return await request('/system/status');
    } catch {
      return getLocalSystemStatus();
    }
  },

  async getModelConfig(): Promise<ModelConfig> {
    return request('/model/config');
  },

  async updateModelConfig(input: {
    enabled: boolean;
    provider: ModelConfig['provider'];
    apiMode: ModelConfig['apiMode'];
    baseUrl: string;
    model: string;
    apiKey?: string;
    clearApiKey?: boolean;
  }): Promise<ModelConfig> {
    return request('/model/config', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async testModel(): Promise<{ ok: boolean; message: string; config: ModelConfig }> {
    return request('/model/test', { method: 'POST', body: '{}' });
  },
};
