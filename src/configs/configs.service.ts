import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from './configs.types';
import * as typia from 'typia';
import { IS_PRODUCTION } from '../shared/utils/is-production';
import { ConfigError } from './configs.error';

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
      JWT_SECRET: process.env.JWT_SECRET,
      APP_PORT: +`${process.env.APP_PORT}`,
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
      JWT_SECRET: this.dotEnv.get('JWT_SECRET'),
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
