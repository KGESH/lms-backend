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
import {
  CreateUiCarouselReviewItemDto,
  UpdateUiCarouselReviewItemDto,
} from '../../../src/v1/ui/component/carousel/carousel-review/ui-carousel-review.dto';
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
        const message = JSON.stringify(carouselCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual(UI_CAROUSEL_TYPE.REVIEW);

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
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
          uiCarousel.ui.uiComponentId,
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        const message = JSON.stringify(itemsCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
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
        const message = JSON.stringify(carouselCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual('carousel.review');

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
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
          uiCarousel.ui.uiComponentId,
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        const message = JSON.stringify(itemsCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const items = itemsCreateResponse.data;
      expect(items.length).toEqual(createCarouselReviewItemDtos.length);
      expect(items[0].uiCarouselId).toEqual(uiCarousel.ui.id);

      const carouselGetResponse = await CarouselReviewAPI.getUiCarouselReview(
        {
          host,
          headers: { LmsSecret },
        },
        uiCarousel.ui.uiComponentId,
      );

      if (!carouselGetResponse.success) {
        const message = JSON.stringify(carouselGetResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const carouselWithItems = carouselGetResponse.data;
      if (!carouselWithItems) {
        const message = JSON.stringify(carouselGetResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
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

  describe('Update UI review carousel items (review)', () => {
    it('should be update UI review carousel items success', async () => {
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
        const message = JSON.stringify(carouselCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual('carousel.review');

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          title: 'First title',
          rating: 1,
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
          title: 'Second title',
          content: 'Second content',
          rating: 2,
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
          uiCarousel.ui.uiComponentId,
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        const message = JSON.stringify(itemsCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const items = itemsCreateResponse.data;
      expect(items.length).toEqual(createCarouselReviewItemDtos.length);
      expect(items[0].uiCarouselId).toEqual(uiCarousel.ui.id);

      const updateDtos: UpdateUiCarouselReviewItemDto[] = [
        {
          id: items[0].id,
          rating: 5,
        },
        {
          id: items[1].id,
          rating: 5,
        },
      ];

      const updatedResponse =
        await CarouselReviewAPI.item.updateUiCarouselReviewItems(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: manager.userSession.id,
            },
          },
          updateDtos,
        );
      if (!updatedResponse.success) {
        const message = JSON.stringify(updatedResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updatedItems = updatedResponse.data;
      expect(updatedItems.length).toEqual(updateDtos.length);
      expect(updatedItems[0].rating).toEqual(5);
      expect(updatedItems[1].rating).toEqual(5);
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
        const message = JSON.stringify(carouselCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const uiCarousel = carouselCreateResponse.data;
      expect(uiCarousel.ui.carouselType).toEqual(UI_CAROUSEL_TYPE.REVIEW);

      const createCarouselReviewItemDtos: CreateUiCarouselReviewItemDto[] = [
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
        },
        {
          ...typia.random<CreateUiCarouselReviewItemDto>(),
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
          uiCarousel.ui.uiComponentId,
          createCarouselReviewItemDtos,
        );

      if (!itemsCreateResponse.success) {
        const message = JSON.stringify(itemsCreateResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
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
        const message = JSON.stringify(deleteItemsResponse.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const deletedItems = deleteItemsResponse.data;
      expect(deletedItems.length).toEqual(items.length);
    });
  });
});
