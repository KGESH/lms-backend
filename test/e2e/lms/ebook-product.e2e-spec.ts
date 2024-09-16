import { INestApplication } from '@nestjs/common';
import * as EbookProductAPI from '../../../src/api/functional/v1/product/ebook';
import * as typia from 'typia';
import * as date from '../../../src/shared/utils/date';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  createRandomEbookProduct,
  seedEbookProducts,
} from '../helpers/db/lms/ebook-product.helper';
import {
  CreateEbookProductDto,
  UpdateEbookProductDto,
} from '@src/v1/product/ebook-product/ebook-product.dto';
import { createRandomEbook } from '../helpers/db/lms/ebook.helper';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('EbookProductController (e2e)', () => {
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

  describe('[Get ebook product]', () => {
    it('should be get a ebook product success', async () => {
      const product = await createRandomEbookProduct(drizzle.db);

      const response = await EbookProductAPI.getEbookProduct(
        {
          host,
          headers: { LmsSecret },
        },
        product.ebookId,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const foundEbookProduct = response.data;
      expect(foundEbookProduct).not.toBeNull();
      expect(foundEbookProduct!.title).toEqual(product.lastSnapshot?.title);
    });
  });

  describe('[Create ebook product]', () => {
    it('should be create ebook product success', async () => {
      const { ebook } = await createRandomEbook(drizzle.db);
      const createDto: CreateEbookProductDto = {
        ...typia.random<CreateEbookProductDto>(),
        title: 'mock-product',
        description: null,
        pricing: {
          amount: '100000',
        },
        announcement: {
          richTextContent: '테스트 공지사항',
        },
        refundPolicy: {
          richTextContent: '테스트 환불정책',
        },
        uiContents: [
          {
            type: 'main-banner',
            content: '테스트 비디오 배너',
            metadata: null,
            description: 'mock main banner',
            sequence: 1,
            url: 'https://www.youtube.com',
          },
          {
            type: 'target-description',
            content: '테스트 타겟 말풍선',
            metadata: null,
            description: null,
            sequence: 1,
            url: null,
          },
          {
            type: 'tag',
            content: '테스트 구매 대상 태그',
            metadata: null,
            description: null,
            sequence: 1,
            url: null,
          },
        ],
      };

      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const response = await EbookProductAPI.createProductEbook(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        ebook.id,
        createDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const product = response.data;
      expect(product.title).toEqual('mock-product');
      expect(product.description).toEqual(null);
      expect(product.ebookId).toEqual(ebook.id);
      expect(product.pricing.amount).toEqual('100000');
      expect(product.announcement.richTextContent).toEqual('테스트 공지사항');
      expect(product.refundPolicy.richTextContent).toEqual('테스트 환불정책');
      expect(
        product.uiContents.find((ui) => ui.type === 'main-banner')!.url,
      ).toEqual('https://www.youtube.com');
      expect(
        product.uiContents.find((ui) => ui.type === 'target-description')!
          .content,
      ).toEqual('테스트 타겟 말풍선');
      expect(
        product.uiContents.find((ui) => ui.type === 'tag')!.content,
      ).toEqual('테스트 구매 대상 태그');
    });
  });

  describe('[Update ebook product]', () => {
    it('should be update ebook product success', async () => {
      const { ebookId, lastSnapshot } = (
        await seedEbookProducts({ count: 1 }, drizzle.db)
      )[0];

      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const updateDto: UpdateEbookProductDto = {
        title: 'updated product title',
        description: 'updated description',
        pricing: {
          amount: '10000',
        },
        announcement: {
          richTextContent: 'updated announcement',
        },
        content: {
          richTextContent: 'updated content',
        },
        refundPolicy: {
          richTextContent: 'updated refund policy',
        },
        discount: {
          discountType: 'percent',
          enabled: true,
          validFrom: date.now('iso'),
          validTo: date.now('iso'),
          value: '33.33',
        },
        uiContents: {
          create: [
            {
              type: 'target-description',
              content: 'mock new content',
              description: null,
              metadata: null,
              sequence: 1,
              url: null,
            },
          ],
          update: [],
        },
      };

      const response = await EbookProductAPI.updateProductEbook(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        ebookId,
        updateDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const updated = response.data;

      expect(updated.title).toEqual('updated product title');
      expect(updated.description).toEqual('updated description');
      expect(updated.pricing.amount).toEqual('10000');
      expect(updated.announcement.richTextContent).toEqual(
        'updated announcement',
      );
      expect(updated.content.richTextContent).toEqual('updated content');
      expect(updated.refundPolicy.richTextContent).toEqual(
        'updated refund policy',
      );
      expect(updated.discount!.value).toEqual('33.33');
      expect(
        updated.uiContents.find((ui) => ui.content === 'mock new content'),
      ).toBeDefined();
    });
  });
});
