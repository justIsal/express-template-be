import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export const validate =
  (schema: z.Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      const errorMessages = error.errors.map((err: any) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: errorMessages.join(', '),
      });
    }
  };
