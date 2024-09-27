import { Injectable, NotFoundException } from '@nestjs/common';
import { FileService } from '@src/v1/file/file.service';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import * as typia from 'typia';
import { FileQueryService } from '@src/v1/file/file-query.service';

@Injectable()
export class ProductThumbnailService {
  constructor(
    private readonly fileService: FileService,
    private readonly fileQueryService: FileQueryService,
  ) {}

  // async createProductThumbnail(
  //   params: IProductThumbnailCreate,
  //   tx: TransactionClient,
  // ): Promise<IProductThumbnail> {
  //   // const thumbnail = await this.fileService.createFile(
  //   //   {
  //   //     ...params,
  //   //     filename: null,
  //   //   },
  //   //   tx,
  //   // );
  //   // return typia.assert<IProductThumbnail>(thumbnail);
  // }

  // async updateProductThumbnail(
  //   where: Pick<IProductThumbnail, 'id'>,
  //   params: IProductThumbnailUpdate,
  //   tx: TransactionClient,
  // ): Promise<IProductThumbnail> {
  //   const [deletedFileId] = await this.fileService.softDeleteManyFiles(
  //     { ids: [where.id] },
  //     tx,
  //   );
  //   const thumbnail = await this.fileService.createFile({}, tx);
  //
  //   // const thumbnail = await this.fileService.updateFile(where, params, tx);
  //   // return typia.assert<IProductThumbnail>(thumbnail);
  // }

  async findProductThumbnailOrThrow(
    where: Pick<IProductThumbnail, 'id'>,
  ): Promise<IProductThumbnail> {
    const thumbnail = await this.fileQueryService.findFile(where);

    if (!thumbnail) {
      throw new NotFoundException('Thumbnail not found');
    }

    return typia.assert<IProductThumbnail>(thumbnail);
  }

  async deleteProductThumbnail(
    where: Pick<IProductThumbnail, 'id'>,
    tx: TransactionClient,
  ): Promise<IProductThumbnail['id']> {
    const [deletedFileId] = await this.fileService.softDeleteManyFiles(
      [where.id],
      tx,
    );
    return deletedFileId;
  }
}
