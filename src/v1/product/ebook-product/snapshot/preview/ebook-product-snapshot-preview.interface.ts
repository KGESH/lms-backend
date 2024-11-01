import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IFile } from '@src/v1/file/file.interface';

export type IEbookProductSnapshotPreview = {
  id: Uuid;
  productSnapshotId: Uuid;
  fileId: IFile['id'];
};

export type IEbookProductSnapshotPreviewCreate = Optional<
  IEbookProductSnapshotPreview,
  'id'
>;
