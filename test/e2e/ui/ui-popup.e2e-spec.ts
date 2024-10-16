import { INestApplication } from '@nestjs/common';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import {
  CreateUiPopupDto,
  UpdateUiPopupDto,
} from '../../../src/v1/ui/component/popup/ui-popup.dto';
import * as PopupAPI from '../../../src/api/functional/v1/ui/component/popup';
import * as UiComponentAPI from '../../../src/api/functional/v1/ui/component';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('UiPopupController (e2e)', () => {
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

  describe('Create UI popup', () => {
    it('should be create UI popup success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiPopupDto = typia.random<CreateUiPopupDto>();

      const response = await PopupAPI.createUiPopup(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const uiPopup = response.data;
      expect(uiPopup.category).toEqual('popup');
      expect(uiPopup.ui.title).toEqual(createDto.ui.title);
    });
  });

  describe('Get UI popup', () => {
    it('should be get UI popup success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiPopupDto = typia.random<CreateUiPopupDto>();

      const createResponse = await PopupAPI.createUiPopup(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createDto,
      );
      if (!createResponse.success) {
        const message = JSON.stringify(createResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const uiPopup = createResponse.data;

      const getResponse = await PopupAPI.getUiPopup(
        {
          host,
          headers: { LmsSecret },
        },
        uiPopup.ui.uiComponentId,
      );
      if (!getResponse.success) {
        const message = JSON.stringify(getResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const fetchedUiPopup = getResponse.data;
      if (!fetchedUiPopup) {
        throw new Error('assert');
      }

      expect(fetchedUiPopup.ui.title).toEqual(uiPopup.ui.title);
    });
  });

  describe('Update UI popup', () => {
    it('should be update UI popup success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const randomCreateDto = typia.random<CreateUiPopupDto>();
      const createDto: CreateUiPopupDto = {
        ...randomCreateDto,
        ui: {
          ...randomCreateDto.ui,
        },
      };
      const createResponse = await PopupAPI.createUiPopup(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createDto,
      );
      if (!createResponse.success) {
        const message = JSON.stringify(createResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const uiPopup = createResponse.data;
      const updateDto: UpdateUiPopupDto = {
        ...uiPopup,
        ui: {
          ...uiPopup.ui,
          title: 'updated ui popup title',
          description: null,
          metadata: null,
          json: {
            v2: {
              button: {
                label: 'Get Promo',
                href: 'https://galglismoney.com/promo/get-random-promo',
              },
            },
          },
        },
      };

      const updateResponse = await PopupAPI.updateUiPopup(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        uiPopup.ui.uiComponentId,
        updateDto,
      );
      if (!updateResponse.success) {
        const message = JSON.stringify(updateResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const updatedUiPopup = updateResponse.data;
      expect(updatedUiPopup.ui.title).toEqual('updated ui popup title');
      expect(updatedUiPopup.ui.description).toBeNull();
      expect(updatedUiPopup.ui.metadata).toBeNull();
      expect(updatedUiPopup.ui.json.v2.button.label).toEqual('Get Promo');
      expect(updatedUiPopup.ui.json.v2.button.href).toEqual(
        'https://galglismoney.com/promo/get-random-promo',
      );
    });
  });

  describe('Delete UI popup', () => {
    it('should be delete UI popup success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiPopupDto = typia.random<CreateUiPopupDto>();

      const createResponse = await PopupAPI.createUiPopup(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        createDto,
      );
      if (!createResponse.success) {
        const message = JSON.stringify(createResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const uiPopup = createResponse.data;

      const deleteResponse = await UiComponentAPI.deleteUiComponent(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        uiPopup.ui.uiComponentId,
      );
      if (!deleteResponse.success) {
        const message = JSON.stringify(deleteResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const deletedUiComponent = deleteResponse.data;
      expect(deletedUiComponent.uiComponentId).toEqual(
        uiPopup.ui.uiComponentId,
      );

      // GET result after delete
      const afterDeleteResponse = await PopupAPI.getUiPopup(
        {
          host,
          headers: { LmsSecret },
        },
        uiPopup.ui.uiComponentId,
      );
      if (!afterDeleteResponse.success) {
        const message = JSON.stringify(afterDeleteResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      expect(afterDeleteResponse.data).toBeNull();
    });
  });
});
