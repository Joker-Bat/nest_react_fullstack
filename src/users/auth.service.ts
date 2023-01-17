import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { Role } from '../enums/role.enum';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  getRandomBytes() {
    return randomBytes(8).toString('hex');
  }

  async getHashedPassword(password: string, salt: string) {
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash;
  }

  async comparePassword(storedPassword: string, newPassword: string) {
    const [salt, storedHash] = storedPassword.split('.');

    const hashedPassword = await this.getHashedPassword(newPassword, salt);

    return storedHash === hashedPassword.split('.')[1];
  }

  async signup(email: string, password: string, role: Role) {
    const users = await this.usersService.find(email);

    if (users.length > 0) {
      throw new BadRequestException('Email already in use');
    }

    // Generate a salt
    const salt = this.getRandomBytes();

    // Hash the salt and the password togeather
    const hashedPassword = await this.getHashedPassword(password, salt);

    // Create new user and save it
    const user = await this.usersService.create(email, hashedPassword, role);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordSame = await this.comparePassword(user.password, password);

    if (!isPasswordSame) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async resetPassword(id: number, attrs: ResetPasswordDto) {
    const user = await this.usersService.findOne(id);
    const { oldPassword, newPassword } = attrs;

    if (!user) throw new NotFoundException('User not found');

    // Compare if old password is matching
    const isPasswordSame = await this.comparePassword(
      user.password,
      oldPassword,
    );
    if (!isPasswordSame) throw new BadRequestException('Invalid old password');

    // Create a hashed new password and set
    const salt = this.getRandomBytes();
    const hashedPassword = await this.getHashedPassword(newPassword, salt);
    const curUser = this.usersService.resetPassword(user.id, hashedPassword);

    return curUser;
  }
}
