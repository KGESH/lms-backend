import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import * as UiComponentAPI from '../../../src/api/functional/v1/ui/component';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedUiRepeatTimer } from '../helpers/db/ui/repeat-timer.helper';
import { seedCarouselReview } from '../helpers/db/ui/carousel-review.helper';

describe('UiComponentController (e2e)', () => {
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

  describe('Get UI components by path', () => {
    it('should be get many UI components by root path "/" success', async () => {
      const manager = (
        await seedUsers({ count: 1, role: 'manager' }, drizzle.db)
      )[0];
      const path = '/';
      await seedCarouselReview({ count: 1 }, drizzle.db, path);
      await seedUiRepeatTimer({ count: 2 }, drizzle.db, path);

      const response = await UiComponentAPI.getUiComponentsByPath(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: manager.userSession.id,
          },
        },
        { path },
      );

      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const ui = response.data;
      expect(ui['carousel'].length).toEqual(1);
      expect(ui['carousel'][0].path).toEqual('/');
      expect(ui['repeat-timer'].length).toEqual(2);
      expect(ui['repeat-timer'][0].path).toEqual('/');
    });
  });
});
