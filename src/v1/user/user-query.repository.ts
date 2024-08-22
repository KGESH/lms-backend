import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { IUser } from '@src/v1/user/user.interface';
import { dbSchema } from '@src/infra/db/schema';
import { Pagination } from '@src/shared/types/pagination';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<IUser, 'id'>): Promise<IUser | null> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(dbSchema.users.id, where.id),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneOrThrow(where: Pick<IUser, 'id'>): Promise<IUser> {
    const user = await this.findOne(where);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(where: Pick<IUser, 'email'>): Promise<IUser | null> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(dbSchema.users.email, where.email),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findMany(pagination: Pagination): Promise<IUser[]> {
    return await this.drizzle.db.query.users.findMany({
      orderBy: (user, { desc }) => desc(user.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    });
  }
}
