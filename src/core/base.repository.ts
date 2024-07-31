import { IPagination } from '../shared/types/pagination';
import { TransactionClient } from '../infra/db/drizzle.types';

export type IRepository<T> = {
  findOne(where: Partial<T>): Promise<T | null>;

  findOneOrThrow(where: Partial<T>): Promise<T>;

  findMany(pagination: IPagination): Promise<T[]>;

  create(params: Partial<T>, db: TransactionClient): Promise<T>;

  update(
    where: Partial<T>,
    params: Partial<T>,
    db: TransactionClient,
  ): Promise<T>;

  delete(where: Partial<T>, db: TransactionClient): Promise<T>;
};
