import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class CouponDisposableRepository {
  constructor(private readonly drizzle: DrizzleService) {}
}
