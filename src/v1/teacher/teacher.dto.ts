import { Uuid } from '../../shared/types/primitive';
import { UserWithoutPasswordDto } from '../user/user.dto';

export type TeacherDto = {
  id: Uuid;
  userId: Uuid;
  account: UserWithoutPasswordDto;
};
