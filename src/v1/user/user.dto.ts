import { EMail, Uuid } from '../../shared/types/primitive';
import { IPagination } from '../../shared/types/pagination';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};

export type PaginationDto = Partial<IPagination>;
