import { Injectable } from '@nestjs/common';
import { FileRepository } from '@src/v1/file/file.repository';
import { IFile, IFileCreate } from '@src/v1/file/file.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFile(params: IFileCreate, tx?: TransactionClient): Promise<IFile> {
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
}
