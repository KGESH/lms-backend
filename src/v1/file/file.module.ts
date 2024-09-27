import { Module } from '@nestjs/common';
import { S3Module } from '@src/infra/s3/s3.module';
import { FileController } from '@src/v1/file/file.controller';
import { FileService } from '@src/v1/file/file.service';
import { FileRepository } from '@src/v1/file/file.repository';
import { FileQueryService } from '@src/v1/file/file-query.service';
import { FileQueryRepository } from '@src/v1/file/file-query.repository';

const modules = [S3Module];

const providers = [
  FileService,
  FileRepository,
  FileQueryService,
  FileQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [FileController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class FileModule {}
