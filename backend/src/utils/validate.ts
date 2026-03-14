import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    console.log(result);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues,
      });
    }

    next();
  };
