import { Injectable, Logger } from '@nestjs/common';
import { FileRepository } from '@src/v1/file/file.repository';
import {
  IFile,
  IFileCreate,
  IFileUpdate,
  IPreSignedUrl,
  IPreSignedUrlCreate,
} from '@src/v1/file/file.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { S3Service } from '@src/infra/s3/s3.service';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileRepository: FileRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createPreSignedUrls(
    params: IPreSignedUrlCreate[],
    access: 'public' | 'private' = 'public',
  ): Promise<IPreSignedUrl[]> {
    const urls = await Promise.all(
      params.map((param) =>
        this.s3Service.createPreSignedUrl(param.id, access),
      ),
    );

    // Aggregate the pre-signed URLs with the input params
    return params.map((param, index) => ({
      ...param,
      url: urls[index],
    }));
  }

  async createVideoPreSignedUrl(
    params: IPreSignedUrlCreate[],
  ): Promise<IPreSignedUrl[]> {
    const urls = await Promise.all(
      params.map((param) => this.s3Service.createVideoPreSignedUrl(param.id)),
    );

    return params.map((param, index) => ({
      ...param,
      url: urls[index],
    }));
  }

  async createFile(
    params: IFileCreate,
    tx?: TransactionClient,
  ): Promise<IFile> {
    const [file] = await this.fileRepository.createManyFiles([params], tx);
    return file;
  }

  async createManyFiles(
    params: IFileCreate[],
    tx?: TransactionClient,
  ): Promise<IFile[]> {
    const files = await this.fileRepository.createManyFiles(params, tx);
    return files;
  }

  async updateFile(
    where: Pick<IFile, 'id'>,
    params: IFileUpdate,
    tx?: TransactionClient,
  ): Promise<IFile> {
    const file = await this.fileRepository.updateFile(where, params, tx);
    return file;
  }

  async softDeleteManyFiles(
    ids: IFile['id'][],
    tx?: TransactionClient,
  ): Promise<IFile['id'][]> {
    return await this.fileRepository.softDeleteManyFiles(ids, tx);
  }

  async softDeleteManyFilesOrRollback(
    ids: IFile['id'][],
  ): Promise<IFile['id'][]> {
    return await this.drizzle.db.transaction(async (tx) => {
      return await this.fileRepository.softDeleteManyFiles(ids, tx);
    });
  }
}
