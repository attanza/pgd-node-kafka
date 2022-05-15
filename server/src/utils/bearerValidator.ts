import { NextFunction } from 'express';
import Logger from 'jet-logger';
import jwt from 'jsonwebtoken';
import { HttpException } from '../app/exceptions/http.exception';
import { IRequest } from '../app/interfaces/request.interface';
import { ITokenData } from '../app/interfaces/token.interface';
import UserModel from '../app/models/user.model';
export const bearerValidator = async (req: IRequest, next: NextFunction) => {
  Logger.info('BEARER VALIDATOR');
  const authorization = req.headers.authorization;
  if (!authorization) {
    next(new HttpException(401, 'Unauthorized'));
    return;
  }
  const tokenSplit = authorization.split(' ');

  if (tokenSplit[0] !== 'Bearer') {
    next(new HttpException(401, 'Unauthorized'));
    return;
  }
  if (tokenSplit[1] === '') {
    next(new HttpException(401, 'Unauthorized'));
    return;
  }
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(tokenSplit[1], secret) as ITokenData;
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
