import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { ITeacher, ITeacherInfo } from './teacher.interface';

@Injectable()
export class TeacherQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyWithInfo(): Promise<
    (ITeacher & { info: ITeacherInfo | null })[]
  > {
    return await this.drizzle.db.query.teachers.findMany({
      with: {
        info: true,
      },
    });
  }
}
