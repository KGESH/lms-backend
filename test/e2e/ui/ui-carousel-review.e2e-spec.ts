import { INestApplication } from '@nestjs/common';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import * as CarouselReviewAPI from '../../../src/api/functional/v1/ui/component/carousel_review';
import { CreateUiCarouselDto } from '../../../src/v1/ui/component/carousel/ui-carousel.dto';
import {
  UI_CAROUSEL_TYPE,
  UiCarouselReview,
} from '../../../src/v1/ui/category/ui-category.interface';
import { CreateUiCarouselReviewItemDto } from '../../../src/v1/ui/component/carousel/carousel-review/ui-carousel-review.dto';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('UiCarouselReviewController (e2e)', () => {
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

  describe('Create UI review carousel with items', () => {
    it('should be create UI review carousel success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createCarouselDto: CreateUiCarouselDto<UiCarouselReview> =
        typia.random<CreateUiCarouselDto<UiCarouselReview>>();

      const carouselCreateResponse =
        await CarouselReviewAPI.createUiCarouselReview(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          createCarouselDto,
        );

      if (!carouselCreateResponse.success) {
        throw new Error('assert');
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual(UI_CAROUSEL_TYPE.REVIEW);

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
      ];

      const itemsCreateResponse =
        await CarouselReviewAPI.item.createUiCarouselReviewItems(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        throw new Error('assert');
      }

      const items = itemsCreateResponse.data;
      expect(items.length).toEqual(createCarouselReviewItemDtos.length);
      expect(items[0].uiCarouselId).toEqual(uiCarousel.ui.id);
    });
  });

  describe('Get UI review carousel with items', () => {
    it('should be get UI review carousel success', async () => {
      const manager = (
        await seedUsers({ count: 1, role: 'manager' }, drizzle.db)
      )[0];

      const createCarouselDto: CreateUiCarouselDto<UiCarouselReview> =
        typia.random<CreateUiCarouselDto<UiCarouselReview>>();

      const carouselCreateResponse =
        await CarouselReviewAPI.createUiCarouselReview(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          createCarouselDto,
        );

      if (!carouselCreateResponse.success) {
        throw new Error('assert');
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual('carousel.review');

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
      ];

      const itemsCreateResponse =
        await CarouselReviewAPI.item.createUiCarouselReviewItems(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        throw new Error('assert');
      }

      const items = itemsCreateResponse.data;
      expect(items.length).toEqual(createCarouselReviewItemDtos.length);
      expect(items[0].uiCarouselId).toEqual(uiCarousel.ui.id);

      const carouselGetResponse = await CarouselReviewAPI.getUiCarouselReview(
        {
          host,
          headers: { LmsSecret },
        },
        uiCarousel.ui.id,
      );

      if (!carouselGetResponse.success) {
        throw new Error('assert');
      }

      const carouselWithItems = carouselGetResponse.data;
      if (!carouselWithItems) {
        throw new Error('assert');
      }

      expect(carouselWithItems.uiCarousel.ui.id).toEqual(uiCarousel.ui.id);
      expect(carouselWithItems.uiCarouselReviewItems.length).toEqual(
        createCarouselReviewItemDtos.length,
      );
      expect(carouselWithItems.uiCarousel.ui.carouselType).toEqual(
        UI_CAROUSEL_TYPE.REVIEW,
      );
    });
  });

  describe('Delete UI review carousel items', () => {
    it('should be delete UI review carousel items success', async () => {
      const manager = (
        await seedUsers({ count: 1, role: 'manager' }, drizzle.db)
      )[0];

      const createCarouselDto: CreateUiCarouselDto<UiCarouselReview> =
        typia.random<CreateUiCarouselDto<UiCarouselReview>>();

      const carouselCreateResponse =
        await CarouselReviewAPI.createUiCarouselReview(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          createCarouselDto,
        );

      if (!carouselCreateResponse.success) {
        throw new Error('assert');
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual(UI_CAROUSEL_TYPE.REVIEW);

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          uiCarouselId: uiCarousel.ui.id,
        },
      ];

      const itemsCreateResponse =
        await CarouselReviewAPI.item.createUiCarouselReviewItems(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        throw new Error('assert');
      }

      const items = itemsCreateResponse.data;
      expect(items.length).toEqual(createCarouselReviewItemDtos.length);
      expect(items[0].uiCarouselId).toEqual(uiCarousel.ui.id);

      const deleteItemsResponse =
        await CarouselReviewAPI.item.deleteUiCarouselReviewItems(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          {
            ids: items.map((item) => item.id),
          },
        );

      if (!deleteItemsResponse.success) {
        throw new Error('assert');
      }

      const deletedItems = deleteItemsResponse.data;
      expect(deletedItems.length).toEqual(items.length);
    });
  });
});
