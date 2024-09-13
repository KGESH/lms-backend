import { ProductUiContentType, UInt, Uuid } from '@src/shared/types/primitive';

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
