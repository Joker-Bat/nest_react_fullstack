import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsEnum(Role)
  @ApiProperty({ enum: Role, enumName: 'role' })
  role: Role = Role.User;
}
