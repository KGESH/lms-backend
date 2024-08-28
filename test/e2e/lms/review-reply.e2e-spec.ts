import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { seedCourseReviews } from '../helpers/db/lms/review.helper';
import * as ReviewAPI from '../../../src/api/functional/v1/review';
import { ConfigsService } from '../../../src/configs/configs.service';
import { CreateReviewReplyDto } from '@src/v1/review/review.dto';
import { seedTeachers } from '../helpers/db/lms/teacher.helper';

describe('ReviewController (e2e)', () => {
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

  describe('[Create review reply]', () => {
    it('should be create course review success', async () => {
      const replyAuthor = (await seedTeachers({ count: 1 }, drizzle.db))[0];
      const review = (await seedCourseReviews({ count: 1 }, drizzle.db))[0];
      const reviewReplyCreateParams: CreateReviewReplyDto = {
        comment: 'Good job!',
        reviewId: review.id,
        userId: replyAuthor.user.id,
      };

      const response = await ReviewAPI.reply.createReviewReply(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: replyAuthor.userSession.id,
          },
        },
        reviewReplyCreateParams,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 5);
        throw new Error(`[assert] ${message}`);
      }

      const createdReply = response.data;
      expect(createdReply.snapshot.comment).toEqual('Good job!');
    });
  });
});
