import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IOtp, IOtpCreate } from '@src/v1/auth/otp/otp.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OtpRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createOtp(params: IOtpCreate, db = this.drizzle.db): Promise<IOtp> {
    const [otp] = await db.insert(dbSchema.otps).values(params).returning();
    return otp;
  }

  async deleteOtp(
    where: Pick<IOtp, 'identifier'>,
    db = this.drizzle.db,
  ): Promise<IOtp['identifier']> {
    await db
      .delete(dbSchema.otps)
      .where(eq(dbSchema.otps.identifier, where.identifier));

    return where.identifier;
  }
}
