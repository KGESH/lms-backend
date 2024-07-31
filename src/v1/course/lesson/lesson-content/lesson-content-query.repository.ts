import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../infra/db/drizzle.service';

@Injectable()
export class LessonContentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}
}
