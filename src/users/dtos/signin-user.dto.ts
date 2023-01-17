import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class SigninUserDto extends OmitType(CreateUserDto, ['role'] as const) {}
