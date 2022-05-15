export enum ETransactionStatus {
  PENDING = "PENDING",
  PROCESS1 = "PROCESS1",
  PROCESS2 = "PROCESS2",
  PROCESS3 = "PROCESS3",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export interface ITransactionStatus {
  _id: string;
  status: ETransactionStatus;
  date: string;
}

export interface ITransaction {
  _id: string;
  statuses: ITransactionStatus[];
  createdAt: string;
  updatedAt: string;
}
