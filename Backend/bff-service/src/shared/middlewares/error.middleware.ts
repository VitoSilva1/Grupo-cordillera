import type { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof AppError) {
    if (error.responseBody) {
      res.status(error.statusCode).json(error.responseBody);
      return;
    }

    res.status(error.statusCode).json({
      error: error.message,
      detail: error.details,
    });
    return;
  }

  res.status(500).json({
    error: 'Error interno del BFF',
    detail: error instanceof Error ? error.message : 'unknown',
  });
};
