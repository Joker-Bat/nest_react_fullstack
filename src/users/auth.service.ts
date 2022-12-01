import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);

        if (users.length > 0) {
            throw new BadRequestException('Email already in use');
        }

        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password togeather
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create new user and save it
        const user = await this.usersService.create(email, result);

        // return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}
