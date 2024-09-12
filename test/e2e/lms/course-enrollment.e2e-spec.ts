import { INestApplication } from '@nestjs/common';
import * as UserCourseEnrollmentAPI from '@src/api/functional/v1/user/enrollment/course';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createRandomCourse } from '../helpers/db/lms/course.helper';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  createCourseEnrollment,
  createCourseEnrollmentProgress,
} from '../helpers/db/lms/course-enrollment';

describe('UserCourseEnrollmentController (e2e)', () => {
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

  describe('[Get course enrollment]', () => {
    it('should be get a course', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const { course, lessons } = await createRandomCourse(drizzle.db);
      const enrollment = await createCourseEnrollment(
        {
          courseId: course.id,
          userId: student.user.id,
        },
        drizzle.db,
      );
      const completedLesson = await createCourseEnrollmentProgress(
        {
          enrollmentId: enrollment.id,
          lessonId: lessons[0].id,
        },
        drizzle.db,
      );

      const response = await UserCourseEnrollmentAPI.getCourseEnrollments({
        host,
        headers: { LmsSecret, UserSessionId: student.userSession.id },
      });
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data, null, 4)}`);
      }

      const enrollments = response.data;

      expect(enrollments[0].progresses[0].lessonId).toEqual(
        completedLesson.lessonId,
      );
    });
  });

  describe('[Create course enrollment progress]', () => {
    it('should be complete lesson success', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const { course, lessons } = await createRandomCourse(drizzle.db);
      await createCourseEnrollment(
        {
          courseId: course.id,
          userId: student.user.id,
        },
        drizzle.db,
      );

      const completeLessonResponse =
        await UserCourseEnrollmentAPI.completeLesson(
          {
            host,
            headers: { LmsSecret, UserSessionId: student.userSession.id },
          },
          {
            courseId: course.id,
            lessonId: lessons[0].id,
          },
        );
      if (!completeLessonResponse.success) {
        console.error(completeLessonResponse.data);
        throw new Error(
          `assert - ${JSON.stringify(completeLessonResponse.data, null, 4)}`,
        );
      }

      const { completed, certificate } = completeLessonResponse.data;
      expect(completed.lessonId).toEqual(completed.lessonId);

      const getResponse = await UserCourseEnrollmentAPI.getCourseEnrollment(
        {
          host,
          headers: { LmsSecret, UserSessionId: student.userSession.id },
        },
        course.id,
      );
      if (!getResponse.success || !getResponse.data) {
        console.error(getResponse.data);
        throw new Error(
          `assert - ${JSON.stringify(completeLessonResponse.data, null, 4)}`,
        );
      }

      const { progresses } = getResponse.data;
      expect(progresses.find((p) => p.id === completed.id)).toBeTruthy();
      if (certificate) {
        expect(lessons.length).toEqual(progresses.length);
      }
    });

    it('should be already completed lesson then get 409 status code.', async () => {
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const { course, lessons } = await createRandomCourse(drizzle.db);
      const enrollment = await createCourseEnrollment(
        {
          courseId: course.id,
          userId: student.user.id,
        },
        drizzle.db,
      );
      const completedLesson = await createCourseEnrollmentProgress(
        {
          enrollmentId: enrollment.id,
          lessonId: lessons[0].id,
        },
        drizzle.db,
      );

      const alreadyCompletedResponse =
        await UserCourseEnrollmentAPI.completeLesson(
          {
            host,
            headers: { LmsSecret, UserSessionId: student.userSession.id },
          },
          {
            courseId: course.id,
            lessonId: completedLesson.lessonId,
          },
        );

      if (!alreadyCompletedResponse.success) {
        expect(alreadyCompletedResponse.status).toEqual(409);
      } else {
        throw new Error(`assert`);
      }
    });
  });
});
