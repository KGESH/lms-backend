import { INestApplication } from '@nestjs/common';
import * as LessonContentAPI from '@src/api/functional/v1/course/chapter/lesson/lesson_content';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createRandomCourse } from '../helpers/db/lms/course.helper';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('LessonContentController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;
  let configs: ConfigsService;
  let LmsSecret: string;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
    configs = await app.get(ConfigsService);
    LmsSecret = configs.env.LMS_SECRET;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get lesson content]', () => {
    it('should be get a lesson content success', async () => {
      const {
        userSession: teacherSession,
        course,
        lessons,
        lessonContents,
      } = await createRandomCourse(drizzle.db);

      const lessonContentId = lessonContents[0].id;
      const lessonId = lessonContents[0].lessonId;
      const { chapterId } = lessons.find((lesson) => lesson.id === lessonId)!;

      const response = await LessonContentAPI.getLessonContent(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: teacherSession.id,
          },
        },
        course.id,
        chapterId,
        lessonId,
        lessonContentId,
      );
      if (!response.success || !response.data) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const lessonContentWithHistory = response.data;
      expect(
        lessonContents.find(
          (lessonContent) => lessonContent.id === lessonContentWithHistory.id,
        ),
      ).toBeDefined();
      expect(lessonContentId).toEqual(
        lessonContentWithHistory.history.lessonContentId,
      );
    });
  });

  describe('[Get lesson content]', () => {
    it('should be block lesson content by EnrollmentGuard', async () => {
      const { userSession: notPaidUserSession } = (
        await seedUsers({ count: 1, role: 'user' }, drizzle.db)
      )[0];
      const { course, lessons, lessonContents } = await createRandomCourse(
        drizzle.db,
      );
      const lessonContentId = lessonContents[0].id;
      const lessonId = lessonContents[0].lessonId;
      const { chapterId } = lessons.find((lesson) => lesson.id === lessonId)!;

      const response = await LessonContentAPI.getLessonContent(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: notPaidUserSession.id,
          },
        },
        course.id,
        chapterId,
        lessonId,
        lessonContentId,
      );

      expect(response.status).toEqual(403);
    });
  });

  describe('[Get lesson contents]', () => {
    it('should be get lesson contents', async () => {
      const {
        userSession: teacherSession,
        course,
        lessons,
        lessonContents,
      } = await createRandomCourse(drizzle.db);

      const lessonId = lessonContents[0].lessonId;
      const { chapterId } = lessons.find((lesson) => lesson.id === lessonId)!;

      const response = await LessonContentAPI.getLessonContents(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: teacherSession.id,
          },
        },
        course.id,
        chapterId,
        lessonId,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundLessonContents = response.data;
      expect(foundLessonContents[0].lessonId).toEqual(lessonId);
    });
  });
});
