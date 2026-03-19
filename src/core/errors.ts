import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Custom application error class
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

/**
 * Global Error Handler for Hono
 */
export const globalErrorHandler = (err: Error, c: Context) => {
  console.error('[Error]:', err.message, err.stack);

  if (err instanceof AppError) {
    return c.json(
      { status: 'error', message: err.message },
      err.statusCode as any
    );
  }

  if (err instanceof HTTPException) {
    return c.json(
      { status: 'error', message: err.message },
      err.status
    );
  }

  return c.json(
    { status: 'error', message: 'Internal server error' },
    500
  );
};

export const notFoundHandler = (c: Context) => {
  return c.json({ status: 'error', message: 'Not found' }, 404);
};
