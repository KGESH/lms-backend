import { Uuid } from '../../shared/types/primitive';
import { UserWithoutPasswordDto } from '../user/user.dto';
import { Pagination } from '../../shared/types/pagination';

export type TeacherDto = {
  id: Uuid;
  userId: Uuid;
  account: UserWithoutPasswordDto;
};

export type TeacherQuery = Partial<Pagination>;
