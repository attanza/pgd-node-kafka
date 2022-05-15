import { Document } from 'mongoose';

export enum ETransactionStatus {
  PENDING = 'PENDING',
  PROCESS1 = 'PROCESS1',
  PROCESS2 = 'PROCESS2',
  PROCESS3 = 'PROCESS3',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}

export interface ITransactionStatus {
  status: ETransactionStatus;
  date: Date;
}

export class ITransaction extends Document {
  _id: string;
  statuses: ITransactionStatus[];
  createdAt: Date;
  updatedAt: Date;
}
