import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import * as UiComponentAPI from '../../../src/api/functional/v1/ui/component';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { seedUiRepeatTimer } from '../helpers/db/ui/repeat-timer.helper';
import { seedCarouselReview } from '../helpers/db/ui/carousel-review.helper';
import { seedCarouselMainBanner } from '../helpers/db/ui/carousel-main-banner.helper';

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
      await seedUiRepeatTimer({ count: 2 }, drizzle.db, path);
      await seedCarouselMainBanner({ count: 1 }, drizzle.db, path);
      await seedCarouselReview({ count: 1 }, drizzle.db, path);

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

      const uiGroup = response.data;
      const { repeatTimers, carousel, banners, marketingBanners } = uiGroup;
      const { reviewCarousels, mainBannerCarousels, productCarousels } =
        carousel;

      expect(repeatTimers.length).toEqual(2);
      expect(mainBannerCarousels.length).toEqual(1);
      expect(reviewCarousels.length).toEqual(1);
      expect(productCarousels.length).toEqual(0);
      expect(banners.length).toEqual(0);
      expect(marketingBanners.length).toEqual(0);
      expect(repeatTimers[0].path).toEqual('/');
      expect(mainBannerCarousels[0].uiCarousel.path).toEqual('/');
      expect(reviewCarousels[0].uiCarousel.path).toEqual('/');
    });
  });
});
