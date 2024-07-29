import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IDatabaseConfigs } from '../../configs/configs.types';

export const CONNECTION_POOL = 'CONNECTION_POOL';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<IDatabaseConfigs>()
  .setClassMethodName('forRoot')
  .build();
