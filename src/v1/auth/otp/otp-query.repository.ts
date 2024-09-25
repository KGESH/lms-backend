import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IOtp } from '@src/v1/auth/otp/otp.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class OtpQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findLatestOtpByIdentifier(
    where: Pick<IOtp, 'identifier' | 'usage'>,
  ): Promise<IOtp | null> {
    const [otp] = await this.drizzle.db.query.otps.findMany({
      where: and(
        eq(dbSchema.otps.identifier, where.identifier),
        eq(dbSchema.otps.usage, where.usage),
      ),
      orderBy: (otp, { desc }) => desc(otp.createdAt),
      limit: 1,
    });

    return otp ?? null;
  }
}
