import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3ClientProvider } from './s3.client';

const providers = [S3ClientProvider, S3Service];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class S3Module {}
