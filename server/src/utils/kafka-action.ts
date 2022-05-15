import logger from 'jet-logger';
import { EachMessagePayload, KafkaMessage } from 'kafkajs';
import { ETransactionStatus, ITransaction } from '../app/interfaces/transaction.interface';
import TransactionModel from '../app/models/transaction.model';
import kafkaUtils from './kafka-utils';
import mqttUtils from './mqtt-utils';

export const kafkaActions = ({ topic, message }: EachMessagePayload) => {
  console.log('topic', topic);

  switch (topic) {
    case `transaction-${ETransactionStatus.PENDING}`:
      pendingAction(message);
      break;
    case `transaction-${ETransactionStatus.FAILED}`:
      failedAction(message);
      break;
    case `transaction-${ETransactionStatus.PROCESS1}`:
      process1Action(message);
      break;
    case `transaction-${ETransactionStatus.PROCESS2}`:
      process2Action(message);
      break;
    case `transaction-${ETransactionStatus.PROCESS3}`:
      process3Action(message);
      break;
    case `transaction-${ETransactionStatus.COMPLETED}`:
      completeAction(message);
      break;

    default:
      break;
  }
};

async function nextProcess(
  message: KafkaMessage,
  status: ETransactionStatus,
  nextStatus: ETransactionStatus | undefined
) {
  const payload: any = message.value?.toString();
  const transaction: ITransaction = JSON.parse(payload);

  const sec = generateRandom();

  setTimeout(async () => {
    const statuses = [...transaction.statuses];
    statuses.push({
      status,
      date: new Date(),
    });
    await TransactionModel.updateOne({ _id: transaction._id }, { ...transaction, statuses });
    const updated = await TransactionModel.findById(transaction._id);
    kafkaUtils.produce(`transaction-${nextStatus}`, [{ value: JSON.stringify(updated) }]);
    mqttUtils.sendMessage(
      `node-kafka/${TransactionModel.modelName}/update/${updated?._id}`,
      JSON.stringify(updated)
    );
    nextStatus !== undefined && logger.info(`${status} completed, next is ${nextStatus}`);
  }, sec);
}

async function pendingAction(message: KafkaMessage) {
  const payload: any = message.value?.toString();
  const transaction: ITransaction = JSON.parse(payload);
  kafkaUtils.produce(`transaction-${ETransactionStatus.PROCESS1}`, [
    { value: JSON.stringify(transaction) },
  ]);
  logger.info(`${ETransactionStatus.PENDING} completed, next is ${ETransactionStatus.PROCESS1}`);
}

async function process1Action(message: KafkaMessage) {
  await nextProcess(message, ETransactionStatus.PROCESS1, ETransactionStatus.PROCESS2);
}
async function process2Action(message: KafkaMessage) {
  await nextProcess(message, ETransactionStatus.PROCESS2, ETransactionStatus.PROCESS3);
}
async function process3Action(message: KafkaMessage) {
  await nextProcess(message, ETransactionStatus.PROCESS3, ETransactionStatus.COMPLETED);
}
async function completeAction(message: KafkaMessage) {
  await nextProcess(message, ETransactionStatus.COMPLETED, undefined);
}

function failedAction(message: KafkaMessage) {
  console.log('failedAction', message.value?.toString());
}

function generateRandom() {
  const min = 2000;
  const max = 10000;
  const sec = Math.floor(Math.random() * (max - min + 1)) + min;
  return sec;
}
