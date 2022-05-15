import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';

import { responseDetail, responseSuccess } from '../../utils/responseParser';
import { ParamIdDto } from '../dto/param.dto';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { authMiddleware } from '../middlewares/auth.middleware';
import { paramsValidationMiddleware } from '../middlewares/params-validation.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { UserService } from '../services/user.service';

@Controller('users')
@ClassMiddleware([authMiddleware])
export class UserController {
  private service = new UserService();
  private resource = 'User';
  @Get('')
  async find(req: Request, res: Response) {
    const data = await this.service.find(req);
    return responseSuccess(res, `${this.resource}s`, data);
  }
  @Get(':id')
  @Middleware([paramsValidationMiddleware(ParamIdDto)])
  async get(req: Request, res: Response) {
    const data = await this.service.show(req.params.id);
    return responseDetail(res, this.resource, data);
  }
  @Post('')
  @Middleware(validationMiddleware(CreateUserDto))
  async create(req: Request, res: Response) {
    const body: CreateUserDto = req.body;
    const data = await this.service.create(body, ['email']);
    return responseDetail(res, this.resource, data);
  }
  @Put(':id')
  @Middleware([paramsValidationMiddleware(ParamIdDto), validationMiddleware(UpdateUserDto, true)])
  async update(req: Request, res: Response) {
    const body: UpdateUserDto = req.body;
    const data = await this.service.update(req.params.id, body, ['email']);
    return responseDetail(res, this.resource, data);
  }

  @Delete(':id')
  @Middleware([paramsValidationMiddleware(ParamIdDto)])
  async delete(req: Request, res: Response) {
    const data = await this.service.delete(req.params.id);
    return responseDetail(res, this.resource, 'Deleted');
  }
}
