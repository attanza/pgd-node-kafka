import logger from 'jet-logger';
import { Kafka } from 'kafkajs';

import { IKafkaMessage } from '../app/interfaces/kafka-messages.interface';
import { ETransactionStatus } from '../app/interfaces/transaction.interface';
import { kafkaActions } from './kafka-action';

class KafkaUtils {
  kafka: Kafka;
  connect() {
    try {
      const KAFKA_URL = process.env.KAFKA_URL as string;
      this.kafka = new Kafka({
        clientId: 'my-app',
        brokers: [KAFKA_URL],
        ssl: false,
      });
    } catch (error) {
      console.log('kafka error', error);
    }
  }

  async produce(topic: string, messages: IKafkaMessage[]) {
    const producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();
    await producer.send({
      topic,
      messages,
    });

    await producer.disconnect();
  }

  async consume(topic: string | RegExp) {
    const consumer = this.kafka.consumer({ groupId: 'my-group' });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async (payload) => {
        kafkaActions(payload);
      },
    });
  }

  async createTopics() {
    try {
      const admin = this.kafka.admin();
      const topics: any = [];
      Object.values(ETransactionStatus).map((value) =>
        topics.push({ topic: `transaction-${value}` })
      );
      await admin.createTopics({
        waitForLeaders: true,
        topics,
      });
      await admin.listTopics();
    } catch (error) {
      console.log('create topic error', error);
    }
  }
  async topicList(): Promise<string[]> {
    const admin = this.kafka.admin();
    const results = await admin.listTopics();
    return results;
  }
}

export default new KafkaUtils();
