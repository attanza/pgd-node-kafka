import { verify } from 'argon2';
import { LoginDto } from '../dto/auth.dto';
import { HttpException } from '../exceptions/http.exception';
import { UserService } from './user.service';
import jwt from 'jsonwebtoken';
import Logger from 'jet-logger';
export class AuthService {
  private userService = new UserService();
  async login(data: LoginDto) {
    const user = await this.userService.findOne({ email: data.email });

    if (!user) {
      Logger.info('No User');
      throw new HttpException(401, 'Unauthenticated');
    }

    const isVerified = await verify(user.password, data.password);
    if (!isVerified) {
      Logger.info('Wrong password');

      throw new HttpException(401, 'Unauthenticated');
    }
    if (!user.isActive) {
      Logger.info('Not Active');

      throw new HttpException(401, 'Unauthenticated');
    }
    user.lastLogin = Math.round(new Date().getTime() / 1000);
    await user.save();
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = 60 * 60;
    const token = jwt.sign(
      {
        uid: user._id,
      },
      secret,
      { expiresIn }
    );
    return { token, expiresIn };
  }
}
