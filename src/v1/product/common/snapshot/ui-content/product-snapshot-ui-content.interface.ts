import { ProductUiContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { RequiredField } from '@src/shared/types/required-field';
import { IFile } from '@src/v1/file/file.interface';

export type IProductSnapshotUiContent = {
  id: Uuid;
  productSnapshotId: Uuid;
  fileId: IFile['id'] | null;
  type: ProductUiContentType;
  content: string;
  description: string | null;
  sequence: UInt | null;
  // url: string | null;
  metadata: string | null;
};

export type IProductSnapshotUiContentCreate = Optional<
  IProductSnapshotUiContent,
  'id'
>;

export type IProductSnapshotUiContentUpdate = RequiredField<
  Partial<IProductSnapshotUiContent>,
  'id'
>;

export type IProductSnapshotUiContentWithFile = IProductSnapshotUiContent & {
  file: IFile | null;
};
