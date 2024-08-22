import { Module } from '@nestjs/common';
import { S3Module } from '@src/infra/s3/s3.module';
import { FileController } from '@src/v1/file/file.controller';

@Module({
  imports: [S3Module],
  controllers: [FileController],
  exports: [S3Module],
})
export class FileModule {}
