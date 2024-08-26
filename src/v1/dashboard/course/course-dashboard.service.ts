import { Injectable } from '@nestjs/common';
import { CourseDashboardRepository } from '@src/v1/dashboard/course/course-dashboard.repository';
import {
  ICourseDashboardLessonContentUpdate,
  ICourseDashboardUpdate,
} from '@src/v1/dashboard/course/course-dashboard.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { ILesson } from '@src/v1/course/chapter/lesson/lesson.interface';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { Uuid } from '@src/shared/types/primitive';
import { LessonContentService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.service';
import { LessonContentQueryService } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.service';

@Injectable()
export class CourseDashboardService {
  constructor(
    private readonly lessonContentService: LessonContentService,
    private readonly lessonContentQueryService: LessonContentQueryService,
    private readonly courseDashboardRepository: CourseDashboardRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async updateDashboardSequence(
    params: ICourseDashboardUpdate,
  ): Promise<{ updatedChapters: IChapter[]; updatedLessons: ILesson[] }> {
    const { chapters, lessons } = params;

    return await this.drizzle.db.transaction(async (tx) => {
      const updatedChapters =
        await this.courseDashboardRepository.updateChaptersSequence(
          chapters,
          tx,
        );

      const updatedLessons =
        await this.courseDashboardRepository.updateLessonsSequence(lessons, tx);

      return { updatedChapters, updatedLessons };
    });
  }

  // Todo: Impl swap case
  async updateDashboardLessonContentSequence(
    lessonId: Uuid,
    params: ICourseDashboardLessonContentUpdate[],
  ): Promise<ILessonContent[]> {
    const exists = await this.lessonContentQueryService.findLessonContents({
      lessonId,
    });

    // Validate the [contentType, sequence] uniqueness of lesson contents.
    params.forEach((item) => {
      this.lessonContentService.validateSequence(exists, item);
    });

    return await this.courseDashboardRepository.updateLessonContentsSequence(
      params,
    );
  }
}
