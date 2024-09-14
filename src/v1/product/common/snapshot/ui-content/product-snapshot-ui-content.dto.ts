import { ProductUiContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { RequiredField } from '@src/shared/types/required-field';

export type ProductSnapshotUiContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  type: ProductUiContentType;
  content: string;
  description: string | null;
  sequence: UInt | null;
  url: string | null;
  metadata: string | null;
};

export type UpdateUiContentsDto = {
  create: Omit<ProductSnapshotUiContentDto, 'id' | 'productSnapshotId'>[];
  update: RequiredField<Partial<ProductSnapshotUiContentDto>, 'id'>[];
};
