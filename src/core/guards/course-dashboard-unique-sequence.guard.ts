import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as typia from 'typia';
import { CourseDashboardUpdateDto } from '@src/v1/dashboard/course/course-dashboard.dto';

@Injectable()
export class CourseDashboardUniqueSequenceGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const body = typia.assert<CourseDashboardUpdateDto>(req['body']);

    this._validateUniqueSequence(body);

    return true;
  }

  // Validate the sequence uniqueness of chapters and lessons
  private _validateUniqueSequence(params: CourseDashboardUpdateDto): void {
    const { chapters, lessons } = params;

    const chapterSequenceSet = new Set<number>();
    const lessonSequenceSet = new Set<number>();

    chapters.forEach((chapter) => {
      if (chapterSequenceSet.has(chapter.sequence)) {
        throw new ConflictException(
          `Chapter sequence must be unique. Duplicate sequence: ${chapter.sequence}`,
        );
      }
      chapterSequenceSet.add(chapter.sequence);
    });

    lessons.forEach((lesson) => {
      if (lessonSequenceSet.has(lesson.sequence)) {
        throw new ConflictException(
          `Lesson sequence must be unique. Duplicate sequence: ${lesson.sequence}`,
        );
      }
      lessonSequenceSet.add(lesson.sequence);
    });
  }
}
