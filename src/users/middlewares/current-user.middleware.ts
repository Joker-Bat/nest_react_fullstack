import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { user } = req.session || {};

        if (user?.id) {
            const curUser = await this.usersService.findOne(user.id);
            req.currentUser = curUser;
        }

        next();
    }
}
