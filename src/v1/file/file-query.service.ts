import { Injectable } from '@nestjs/common';
import { FileQueryRepository } from '@src/v1/file/file-query.repository';
import { IFile } from '@src/v1/file/file.interface';

@Injectable()
export class FileQueryService {
  constructor(private readonly fileQueryRepository: FileQueryRepository) {}

  async findFile(where: Pick<IFile, 'id'>): Promise<IFile | null> {
    return await this.fileQueryRepository.findFile(where);
  }
}
