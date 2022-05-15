import { model, Schema } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

import { ITransaction } from '../interfaces/transaction.interface';

const schema = new Schema<ITransaction>(
  {
    statuses: [{ status: String, date: Date }],
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePagination);
const TransactionModel: Pagination<ITransaction> = model<ITransaction, Pagination<ITransaction>>(
  'Transaction',
  schema
);
export default TransactionModel;
