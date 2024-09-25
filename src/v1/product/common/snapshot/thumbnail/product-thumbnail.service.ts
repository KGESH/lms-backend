import { Injectable } from '@nestjs/common';
import { FileService } from '@src/v1/file/file.service';
import {
  IProductThumbnail,
  IProductThumbnailCreate,
} from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import * as typia from 'typia';

@Injectable()
export class ProductThumbnailService {
  constructor(private readonly fileService: FileService) {}

  async createProductThumbnail(
    params: IProductThumbnailCreate,
    tx: TransactionClient,
  ): Promise<IProductThumbnail> {
    const thumbnail = await this.fileService.createFile(params, tx);
    return typia.assert<IProductThumbnail>(thumbnail);
  }
}
