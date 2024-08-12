import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../infra/db/drizzle.service';

@Injectable()
export class LessonQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}
}
