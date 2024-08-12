import { Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';

export type ICategory = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type ICategoryWithChildren = ICategory & {
  children: Array<ICategoryWithChildren>;
};

export type ICategoryCreate = Optional<ICategory, 'id'>;
