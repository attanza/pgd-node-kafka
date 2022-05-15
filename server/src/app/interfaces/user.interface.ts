import { Document } from 'mongoose';
export class IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  isActive: boolean;
  lastLogin: number;
  createdAt: Date;
  updatedAt: Date;
}
