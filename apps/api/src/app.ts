import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { env } from './config/env';
import { apiRouter } from './routes';
import { ApiError } from './utils/ApiError';
import { sendError } from './utils/response';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use((req, _res, next) => {
    const startedAt = Date.now();
    next();
    const duration = Date.now() - startedAt;
    if (env.nodeEnv !== 'test') {
      console.info(`${req.method} ${req.path} ${duration}ms dataSource=demo_seed`);
    }
  });

  app.use('/api', apiRouter);

  app.use((_req, res) => {
    sendError(res, 404, 'not_found', '接口不存在。');
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ApiError) {
      sendError(res, error.statusCode, error.code, error.message, error.details);
      return;
    }

    if (error instanceof ZodError) {
      sendError(res, 422, 'validation_error', '请求参数校验失败。', error.flatten());
      return;
    }

    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      sendError(res, 504, 'request_timeout', '请求处理超时，请稍后重试。');
      return;
    }

    console.error(error);
    sendError(res, 500, 'internal_error', '服务端处理失败。');
  });

  return app;
};
