import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as typia from 'typia';
import { CourseDashboardLessonContentDto } from '@src/v1/dashboard/course/course-dashboard.dto';

@Injectable()
export class CourseDashboardContentUniqueSequenceGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const body = typia.assert<CourseDashboardLessonContentDto[]>(req['body']);

    this._validateUniqueSequence(body);
    console.log(`[Guard] CourseDashboardContentUniqueSequenceGuard`, body);

    return true;
  }

  // Validate the sequence uniqueness of lesson contents.
  // Unique constraint by [contentType, sequence]
  private _validateUniqueSequence(
    params: CourseDashboardLessonContentDto[],
  ): void {
    const lessonContentSet = new Set<string>();

    params.forEach((param) => {
      const key = `${param.contentType}/${param.sequence}`;

      if (lessonContentSet.has(key)) {
        throw new ConflictException(
          `Lesson content [contentType,sequence] must be unique. Duplicate [${param.contentType}, ${param.sequence}]`,
        );
      }

      lessonContentSet.add(key);
    });
  }
}
