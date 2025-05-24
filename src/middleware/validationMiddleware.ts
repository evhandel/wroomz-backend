import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export function validationMiddleware<T>(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(type, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const validationErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      res.status(400).json({
        error: "Validation Error",
        details: validationErrors,
      });
    } else {
      req.body = dtoObject;
      next();
    }
  };
}
