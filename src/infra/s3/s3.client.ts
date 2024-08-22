import { Provider } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigsService } from '@src/configs/configs.service';

export const S3_CLIENT = 'S3_CLIENT';

export const S3ClientProvider: Provider = {
  provide: S3_CLIENT,
  inject: [ConfigsService],
  useFactory: ({ env }: ConfigsService) => {
    return new S3Client({
      region: env.AWS_S3_REGION,
      credentials: {
        accessKeyId: env.AWS_S3_ACCESS_KEY,
        secretAccessKey: env.AWS_S3_SECRET,
      },
    });
  },
};
