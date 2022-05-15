import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import kafkaUtils from '../../utils/kafka-utils';
import { responseCollection, responseDetail, responseSuccess } from '../../utils/responseParser';
import { ParamIdDto } from '../dto/param.dto';
import { ETransactionStatus } from '../interfaces/transaction.interface';
import { paramsValidationMiddleware } from '../middlewares/params-validation.middleware';
import { TransactionService } from '../services/transaction.service';

@Controller('transactions')
export class TransactionController {
  private service = new TransactionService();
  private resource = 'Transaction';
  @Get('')
  async find(req: Request, res: Response) {
    const data = await this.service.find(req);
    return responseCollection(res, `${this.resource}s`, data);
  }
  @Get(':id')
  @Middleware([paramsValidationMiddleware(ParamIdDto)])
  async get(req: Request, res: Response) {
    const data = await this.service.show(req.params.id);
    return responseDetail(res, this.resource, data);
  }
  @Post('')
  async create(req: Request, res: Response) {
    const postData = {
      statuses: [{ status: ETransactionStatus.PENDING, date: new Date() }],
    };
    const data = await this.service.create(postData);
    kafkaUtils.produce(`transaction-${ETransactionStatus.PENDING}`, [
      { value: JSON.stringify(data) },
    ]);
    return responseDetail(res, this.resource, data);
  }
  // @Put(':id')
  // @Middleware([paramsValidationMiddleware(ParamIdDto)])
  // async update(req: Request, res: Response) {
  //   return responseDetail(res, this.resource, data);
  // }

  // @Delete(':id')
  // @Middleware([paramsValidationMiddleware(ParamIdDto)])
  // async delete(req: Request, res: Response) {
  //   const data = await this.service.delete(req.params.id);
  //   return responseDetail(res, this.resource, 'Deleted');
  // }
}
