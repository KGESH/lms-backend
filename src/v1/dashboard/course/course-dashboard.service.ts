import { Injectable } from '@nestjs/common';
import { CourseDashboardRepository } from '@src/v1/dashboard/course/course-dashboard.repository';
import { ICourseDashboardUpdate } from '@src/v1/dashboard/course/course-dashboard.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IChapter } from '@src/v1/course/chapter/chapter.interface';
import { ILesson } from '@src/v1/course/chapter/lesson/lesson.interface';

@Injectable()
export class CourseDashboardService {
  constructor(
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
}
