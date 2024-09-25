import { IFile } from '@src/v1/file/file.interface';

export type IProductThumbnail = IFile;

export type IProductThumbnailCreate = Omit<IProductThumbnail, 'createdAt'>;
