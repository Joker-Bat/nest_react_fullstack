import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @IsString()
  @ApiProperty()
  newPassword: string;
}
