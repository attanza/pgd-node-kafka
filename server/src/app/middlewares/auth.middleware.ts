import { NextFunction, Response } from 'express';
import { bearerValidator } from '../../utils/bearerValidator';
import { cookieValidator } from '../../utils/cookieValidator';
import { HttpException } from '../exceptions/http.exception';
import { IRequest } from '../interfaces/request.interface';
export async function authMiddleware(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  if (req.cookies.Authorization) {
    await cookieValidator(req, next);
  } else if (req.headers.authorization) {
    await bearerValidator(req, next);
  } else {
    next(new HttpException(401, 'Unauthorized'));
  }
}
