import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import { HttpException } from '../exceptions/http.exception';

export function paramsValidationMiddleware(type: any): express.RequestHandler {
  return (req, _, next) => {
    validate(plainToClass(type, req.params)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values((error as any).constraints)
            )
            .join(', ');
          next(new HttpException(422, message));
        } else {
          next();
        }
      }
    );
  };
}
