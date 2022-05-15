import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import {
  responseDelete,
  responseDetail,
  responseSuccess,
} from '../../utils/responseParser';
import { LoginDto } from '../dto/auth.dto';
import { IRequest } from '../interfaces/request.interface';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { AuthService } from '../services/auth.service';

@Controller('')
export class AuthController {
  private service = new AuthService();
  @Post('login')
  @Middleware(validationMiddleware(LoginDto))
  async login(req: IRequest, res: Response) {
    const body: LoginDto = req.body;
    const result = await this.service.login(body);
    const header = `Authorization=${result.token}; HttpOnly; Max-Age=${result.expiresIn}; path=/`;
    res.setHeader('Set-Cookie', header);
    return responseSuccess(res, 'Authentication Succeed', {
      token: result.token,
    });
  }
  @Get('me')
  @Middleware(authMiddleware)
  async me(req: IRequest, res: Response) {
    return responseDetail(res, 'User', req.user);
  }
}
