import { Pool } from 'pg';
import { ConfigsService } from '@src/configs/configs.service';
import { CONNECTION_POOL } from '@src/infra/db/connection-pool.token';
import { NODE_ENV_TEST } from '@src/configs/configs.constant';
import { createTestDbContainer } from '../../../test/e2e/helpers/db/db.helper';

export const ConnectionPoolProvider = {
  provide: CONNECTION_POOL,
  inject: [ConfigsService],
  useFactory: async ({ env }: Pick<ConfigsService, 'env'>) => {
    return new Pool({
      connectionString:
        env.NODE_ENV === NODE_ENV_TEST
          ? await createTestDbContainer()
          : env.DATABASE_URL,
    });
  },
};
