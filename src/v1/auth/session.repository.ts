import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { ISession, ISessionWithUser } from './session.interface';

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
