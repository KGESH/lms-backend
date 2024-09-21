import { INestApplication } from '@nestjs/common';
import * as PurchasedUserDashboardAPI from '../../../src/api/functional/v1/dashboard/user/purchased';
import * as UserCourseHistoryDashboardAPI from '../../../src/api/functional/v1/dashboard/user/history/course';
import * as LessonContentAPI from '../../../src/api/functional/v1/course/chapter/lesson/lesson_content';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedCourseOrders } from '../helpers/db/lms/order.helper';

describe('UserDashboardController (e2e)', () => {
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

  describe('[Get user course resource histories]', () => {
    it('should be get many course resource access histories success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [purchasedUser] = await seedCourseOrders({ count: 1 }, drizzle.db);
      const course = purchasedUser.product.course;
      const chapter = course.chapters[0];
      const lesson = chapter.lessons[0];
      const lessonContent = lesson.lessonContents[0];

      // Make sure the user access to the lesson content (create resource access history)
      const getLessonContentResponse = await LessonContentAPI.getLessonContent(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: purchasedUser.userSession.id,
          },
        },
        course.id,
        chapter.id,
        lesson.id,
        lessonContent.id,
      );
      if (!getLessonContentResponse.success || !getLessonContentResponse.data) {
        const message = JSON.stringify(getLessonContentResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const lessonContentWithHistory = getLessonContentResponse.data;
      expect(lessonContentWithHistory.history!.userId).toEqual(
        purchasedUser.user.id,
      );

      const response =
        await UserCourseHistoryDashboardAPI.getUserCourseResourceHistories(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          {
            courseId: course.id,
            userId: purchasedUser.user.id,
          },
        );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const resourceHistories = response.data;
      expect(resourceHistories[0].courseId).toEqual(course.id);
      expect(
        resourceHistories.find(
          (resourceHistory) =>
            resourceHistory.history.id === lessonContentWithHistory.history!.id,
        ),
      ).toBeDefined();
    });
  });

  describe('[Get purchased users]', () => {
    it('should be get many purchased users success', async () => {
      const [admin] = await seedUsers({ count: 1, role: 'admin' }, drizzle.db);
      const [firstUser] = await seedCourseOrders({ count: 3 }, drizzle.db);

      const response =
        await PurchasedUserDashboardAPI.course.getPurchasedCourseUsers(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          {
            courseId: firstUser.product.courseId,
            orderBy: 'desc',
            page: 1,
            pageSize: 10,
          },
        );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const paginatedResult = response.data;
      const purchasedUsers = paginatedResult.data;
      expect(
        purchasedUsers.find(({ user }) => user.id === firstUser.user.id),
      ).toBeDefined();
      expect(
        purchasedUsers.find(({ order }) => order.id === firstUser.order.id),
      ).toBeDefined();
    });
  });
});
