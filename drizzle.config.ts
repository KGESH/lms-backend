import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const env = new ConfigService();

export default defineConfig({
  schema: './src/infra/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.get('DATABASE_URL') as string,
  },
});
