import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type EbookCategoryDto = {
  id: Uuid;
  parentId: Uuid | null;
  name: string;
  description: string | null;
};

export type EbookCategoryWithChildrenDto = EbookCategoryDto & {
  children: Array<EbookCategoryWithChildrenDto>;
};

export type CreateEbookCategoryDto = Pick<
  EbookCategoryDto,
  'name' | 'parentId' | 'description'
>;

export type UpdateEbookCategoryDto = Omit<Partial<EbookCategoryDto>, 'id'>;

export type EbookCategoryWithChildrenQuery = {
  withChildren?: boolean;
};

export type EbookCategoryQuery = EbookCategoryWithChildrenQuery &
  Partial<Pagination>;
