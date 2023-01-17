import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  ParseIntPipe,
  HttpCode,
  UnauthorizedException,
  Put,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  // return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    if (!user)
      throw new UnauthorizedException('Not authenticated, login again.');
    return user;
  }

  @Get('/signout')
  @HttpCode(200)
  signOut(@Session() session: any) {
    session.user = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.role,
    );
    session.user = {
      id: user.id,
    };
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.user = {
      id: user.id,
    };
    return user;
  }

  @Get('/:id')
  @Roles(Role.User, Role.Admin)
  @ApiCookieAuth()
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @ApiCookieAuth()
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch('/update')
  @Roles(Role.User, Role.Admin)
  @ApiCookieAuth()
  updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    if (!user?.id) throw new UnauthorizedException();

    return this.usersService.updateWithId(user.id, body);
  }

  @Patch('/update/:id')
  @Roles(Role.Admin)
  @ApiCookieAuth()
  updateUserWithId(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateWithId(id, body);
  }

  @Put('/reset_password')
  @Roles(Role.User, Role.Admin)
  @ApiCookieAuth()
  resetPassword(@CurrentUser() user: User, @Body() body: ResetPasswordDto) {
    if (!user?.id) throw new UnauthorizedException();

    return this.authService.resetPassword(user.id, body);
  }
}
