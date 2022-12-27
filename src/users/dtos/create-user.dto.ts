import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role = Role.User;
}
