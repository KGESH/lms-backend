import { ProductUiContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { RequiredField } from '@src/shared/types/required-field';

export type ProductSnapshotUiContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  fileId: Uuid | null;
  type: ProductUiContentType;
  content: string;
  description: string | null;
  sequence: UInt | null;
  metadata: string | null;
};

export type UpdateUiContentsDto = {
  create: Omit<ProductSnapshotUiContentDto, 'id' | 'productSnapshotId'>[];
  update: RequiredField<Partial<ProductSnapshotUiContentDto>, 'id'>[];
};
