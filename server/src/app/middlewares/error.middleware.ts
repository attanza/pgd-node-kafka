import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http.exception';
export function errorMiddleware(
  error: HttpException,
  _: Request,
  res: Response,
  next: NextFunction
) {
  console.log('error', error);

  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).send({
    meta: {
      status,
      message,
    },
  });
}
