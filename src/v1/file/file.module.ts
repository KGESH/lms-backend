import { Module } from '@nestjs/common';
import { S3Module } from '../../infra/s3/s3.module';
import { FileController } from './file.controller';

@Module({
  imports: [S3Module],
  controllers: [FileController],
})
export class FileModule {}
