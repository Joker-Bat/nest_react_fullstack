import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeUsersService = {
            findOne: (id: number) => {
                return Promise.resolve({
                    id,
                    email: 'test@test.com',
                    password: 'password',
                } as User);
            },
            find: (email: string) => {
                return Promise.resolve([
                    { id: 1, email, password: 'password' } as User,
                ]);
            },
            // remove: () => {},
            // update: () => {},
        };

        fakeAuthService = {
            signin: (email: string, password: string) => {
                return Promise.resolve({ id: 1, email, password } as User);
            },
            // signup: () => {}
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findAllUsers returns a list of users with the given email', async () => {
        const users = await controller.findAllUsers('test@test.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('test@test.com');
    });

    it('findUser returns a single user with given id', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
    });

    it('findUser throws an error if user with given id is not found', async () => {
        fakeUsersService.findOne = () => null;

        await expect(controller.findUser('2')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('signin updates session object and returns user', async () => {
        const session: { userId?: number } = {};
        const user = await controller.signin(
            {
                email: 'test@test.com',
                password: 'password',
            },
            session,
        );

        session.userId = user.id;

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});
