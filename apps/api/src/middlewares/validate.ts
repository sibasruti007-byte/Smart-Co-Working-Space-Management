import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request body payload',
          details: error.flatten ? error.flatten().fieldErrors : error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid query parameters',
          details: error.flatten ? error.flatten().fieldErrors : error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

