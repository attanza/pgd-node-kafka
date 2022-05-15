import { AuthController } from '../app/controllers/auth.controller';
import { HomeController } from '../app/controllers/home.controller';
import { KafkaAdminController } from '../app/controllers/kafka-admin.controller';
import { TransactionController } from '../app/controllers/transactions.controller';
import { UserController } from '../app/controllers/users.controller';

export default [
  new AuthController(),
  new HomeController(),
  new UserController(),
  new TransactionController(),
  new KafkaAdminController(),
];
