import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Role } from '../enums/role.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, role: Role) {
    const user = this.repo.create({ email, password, role });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async updateWithId(id: number, attrs: Partial<UpdateUserDto>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }

  async resetPassword(id: number, password: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, { password });

    return this.repo.save(user);
  }
}
