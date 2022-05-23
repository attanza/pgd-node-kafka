import { Server } from '@overnightjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import promiseRouter from 'express-promise-router';
import helmet from 'helmet';
import Logger from 'jet-logger';
import mongoose from 'mongoose';
import morgan from 'morgan';

import getControllers from '../utils/getControllers';
import KafkaUtils from '../utils/kafka-utils';
import mqttUtils from '../utils/mqtt-utils';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notfound.middleware';

export class App extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.connectToMongoDb();
    this.initializeMiddleware();
    super.addControllers(getControllers, promiseRouter);
    this.initializeErrorHandler();
    this.initializeKafka();
  }

  private connectToMongoDb() {
    const MONGO_URI = process.env.MONGO_URI as string;
    mongoose
      .connect(MONGO_URI)
      .then(() => Logger.info('Mongo DB Connected'))
      .catch((err) => Logger.err('Mongo DD connection failed'));
  }

  private initializeMiddleware() {
    this.app.use(
      cors({
        origin: [
          'http://localhost:3000',
          'http://34.101.230.192:3000',
          'http://10.184.15.208:3000',
          'http://pgd.saga.io:3000',
        ],
        credentials: true,
      })
    );
    this.app.use(express.static('public'));
    this.app.use(expressLayouts);
    this.app.set('view engine', 'ejs');
    this.app.use(cookieParser());
    this.app.disable('x-powered-by');
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(morgan('combined'));
  }

  private initializeErrorHandler() {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  private initializeKafka() {
    KafkaUtils.connect();
    KafkaUtils.consume(/transaction-*/i);
    mqttUtils.connect();
  }

  public start(port: number) {
    this.app.listen(port, () => {
      Logger.info(`App running at http://localhost:${port}`);
    });
  }
}
