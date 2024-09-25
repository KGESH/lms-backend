import { IFile } from '@src/v1/file/file.interface';
import { ProductThumbnailType } from '@src/shared/types/primitive';

export type IProductThumbnail = Omit<IFile, 'type'> & {
  type: ProductThumbnailType;
};

export type IProductThumbnailCreate = Omit<IProductThumbnail, 'createdAt'>;
