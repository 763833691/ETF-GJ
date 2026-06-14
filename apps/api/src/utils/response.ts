import type { Response } from 'express';
import { randomUUID } from 'node:crypto';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options?: { statusCode?: number; dataSource?: string },
) => {
  res.status(options?.statusCode ?? 200).json({
    success: true,
    data,
    meta: {
      requestId: randomUUID(),
      dataSource: options?.dataSource ?? 'demo_seed',
      timestamp: new Date().toISOString(),
    },
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: details ?? {},
    },
    meta: {
      requestId: randomUUID(),
      timestamp: new Date().toISOString(),
    },
  });
};
