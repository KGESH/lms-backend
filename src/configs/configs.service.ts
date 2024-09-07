import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from '@src/configs/configs.types';
import * as typia from 'typia';
import { IS_PRODUCTION } from '@src/shared/utils/is-production';
import { ConfigError } from '@src/configs/configs.error';

@Injectable()
export class ConfigsService {
  private readonly logger = new Logger(ConfigsService.name);
  public readonly env: IEnvironment;

  constructor(private readonly dotEnv: ConfigService) {
    this.env = this._loadConfiguration();
    this.logger.verbose(`ConfigsService loaded.`, this.env);
  }

  private _loadConfiguration(): IEnvironment {
    if (IS_PRODUCTION) {
      return this._loadProductionConfigs();
    } else {
      return this._loadDevelopmentConfigs();
    }
  }

  private _loadProductionConfigs(): IEnvironment {
    this.logger.verbose(`Load production configuration`);

    const fromExternal = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      LMS_SECRET: process.env.LMS_SECRET,
      APP_PORT: +`${process.env.APP_PORT}`,
      AWS_S3_REGION: process.env.AWS_S3_REGION,
      AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
      AWS_S3_SECRET: process.env.AWS_S3_SECRET,
      AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
      AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS:
        +`${process.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS}`,
      PORTONE_API_SECRET: process.env.PORTONE_API_SECRET,
      PORTONE_API_BASE_URL: process.env.PORTONE_API_BASE_URL,
    };

    const productionConfigs = typia.validate<IEnvironment>(fromExternal);
    if (!productionConfigs.success) {
      throw new ConfigError(
        'ConfigsService production configs load error.',
        productionConfigs.errors,
      );
    }

    return productionConfigs.data;
  }

  private _loadDevelopmentConfigs(): IEnvironment {
    this.logger.verbose(`Load Development configuration`);

    const fromDotEnv = {
      NODE_ENV: process.env.NODE_ENV,
      APP_PORT: +this.dotEnv.get('APP_PORT'),
      DATABASE_URL: this.dotEnv.get('DATABASE_URL'),
      LMS_SECRET: this.dotEnv.get('LMS_SECRET'),
      AWS_S3_REGION: this.dotEnv.get('AWS_S3_REGION'),
      AWS_S3_ACCESS_KEY: this.dotEnv.get('AWS_S3_ACCESS_KEY'),
      AWS_S3_SECRET: this.dotEnv.get('AWS_S3_SECRET'),
      AWS_S3_BUCKET: this.dotEnv.get('AWS_S3_BUCKET'),
      AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS: +this.dotEnv.get(
        'AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS',
      ),
      PORTONE_API_SECRET: this.dotEnv.get('PORTONE_API_SECRET'),
      PORTONE_API_BASE_URL: this.dotEnv.get('PORTONE_API_BASE_URL'),
    };

    const devConfigs = typia.validate<IEnvironment>(fromDotEnv);
    if (!devConfigs.success) {
      throw new ConfigError(
        'ConfigsService dev configs load error.',
        devConfigs.errors,
      );
    }

    return devConfigs.data;
  }
}
