import { ITransaction } from '../interfaces/transaction.interface';
import TransactionModel from '../models/transaction.model';
import { BaseService } from './base.service';

export class TransactionService extends BaseService<ITransaction> {
  constructor() {
    super(TransactionModel);
  }
}
