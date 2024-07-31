import { EMail, Uuid } from '../../shared/types/primitive';

export type TeacherDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};
