import { Uuid } from '@src/shared/types/primitive';

export type IDeleteEntityMetadata = {
  deletedAt?: Date;
  deletedBy?: Uuid;
  deletedReason?: string;
};
