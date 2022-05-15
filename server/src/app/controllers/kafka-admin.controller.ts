import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import kafkaUtils from '../../utils/kafka-utils';
import mqttUtils from '../../utils/mqtt-utils';
import { responseSuccess } from '../../utils/responseParser';

@Controller('kafka-admin')
export class KafkaAdminController {
  @Get('topics')
  async getTopics(req: Request, res: Response) {
    const topics = await kafkaUtils.topicList();
    return responseSuccess(res, `Kafka Topics`, topics);
  }

  @Post('topics')
  async createTopics(req: Request, res: Response) {
    await kafkaUtils.createTopics();
    return responseSuccess(res, `Kafka topics created`);
  }
  @Post('mqtt')
  async sendMessage(req: Request, res: Response) {
    await mqttUtils.sendMessage('test', 'Test From MQTT');
    return responseSuccess(res, `MQTT message sent`);
  }
}
