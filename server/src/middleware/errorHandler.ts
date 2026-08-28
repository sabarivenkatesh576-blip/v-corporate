import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error. Please try again later.';

  res.status(statusCode).json({
    error: message,
    success: false,
    timestamp: new Date().toISOString()
  });
};
