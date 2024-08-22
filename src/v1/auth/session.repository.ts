import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { ISession, ISessionWithUser } from '@src/v1/auth/session.interface';

@Injectable()
export class SessionRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findSessionWithUserById(
    where: Pick<ISession, 'id'>,
  ): Promise<ISessionWithUser | null> {
    const sessionWithUser = await this.drizzle.db.query.userSessions.findFirst({
      where: eq(dbSchema.userSessions.id, where.id),
      with: {
        user: true,
      },
    });

    if (!sessionWithUser) {
      return null;
    }

    return sessionWithUser;
  }
}
