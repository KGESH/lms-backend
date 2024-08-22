import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type TeacherDto = {
  id: Uuid;
  userId: Uuid;
  account: UserWithoutPasswordDto;
};

export type TeacherQuery = Partial<Pagination>;
