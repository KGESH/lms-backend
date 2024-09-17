import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class CouponTicketPaymentRepository {
  constructor(private readonly drizzle: DrizzleService) {}
}
