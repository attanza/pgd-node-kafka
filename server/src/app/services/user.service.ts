import { IUser } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
import { BaseService } from './base.service';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }
}
