import { dbSchema } from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type TransactionClient = NodePgDatabase<typeof dbSchema>;
