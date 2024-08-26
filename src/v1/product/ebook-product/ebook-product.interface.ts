import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookProduct = {
  id: Uuid;
  ebookId: Uuid;
};

export type IEbookProductCreate = Optional<IEbookProduct, 'id'>;
