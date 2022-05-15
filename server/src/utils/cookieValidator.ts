import { NextFunction } from 'express';
import Logger from 'jet-logger';
import jwt from 'jsonwebtoken';
import { HttpException } from '../app/exceptions/http.exception';
import { IRequest } from '../app/interfaces/request.interface';
import { ITokenData } from '../app/interfaces/token.interface';
import UserModel from '../app/models/user.model';
export const cookieValidator = async (req: IRequest, next: NextFunction) => {
  Logger.info('COOKIE VALIDATOR');
  const token = req.cookies.Authorization;
  if (!token) {
    next(new HttpException(401, 'Unauthorized'));
    return;
  }
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as ITokenData;
    console.log('decoded', decoded);

    const user = await UserModel.findById(decoded.uid);
    if (!user) {
      next(new HttpException(401, 'Unauthorized'));
      return;
    }
    if (!user.isActive) {
      next(new HttpException(401, 'Unauthorized'));
      return;
    }
    req.user = user;
    next();
    return;
  } catch (error) {
    console.log('error', error);
    next(new HttpException(401, 'Unauthorized'));
    return;
  }
};
