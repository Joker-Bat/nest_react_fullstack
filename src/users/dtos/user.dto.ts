import { Expose } from 'class-transformer';
import { Role } from '../../enums/role.enum';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  name: string;

  @Expose()
  phone: string;
}
