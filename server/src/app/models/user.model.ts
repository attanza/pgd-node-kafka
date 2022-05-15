import { hash } from 'argon2';
import { model, Schema } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

import { IUser } from '../interfaces/user.interface';

const schema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    lastLogin: Number,
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

schema.pre('save', async function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    user.password = await hash(user.password);
  } else {
    return next();
  }
});

schema.set('toJSON', {
  transform: function (_: any, ret: any, opt: any) {
    delete ret['password'];
    return ret;
  },
});

schema.plugin(mongoosePagination);
const UserModel: Pagination<IUser> = model<IUser, Pagination<IUser>>(
  'User',
  schema
);

export default UserModel;
