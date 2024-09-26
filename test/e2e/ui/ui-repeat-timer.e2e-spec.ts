import { INestApplication } from '@nestjs/common';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import {
  CreateUiRepeatTimerDto,
  UpdateUiRepeatTimerDto,
} from '../../../src/v1/ui/component/repeat-timer/ui-repeat-timer.dto';
import * as RepeatTimerAPI from '../../../src/api/functional/v1/ui/component/repeat_timer';
import * as UiComponentAPI from '../../../src/api/functional/v1/ui/component';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('UiRepeatTimerController (e2e)', () => {
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

  describe('Create UI repeat timer', () => {
    it('should be create UI repeat timer success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiRepeatTimerDto =
        typia.random<CreateUiRepeatTimerDto>();

      const response = await RepeatTimerAPI.createUiRepeatTimer(
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

      const uiRepeatTimer = response.data;
      expect(uiRepeatTimer.ui.title).toEqual(createDto.ui.title);
    });
  });

  describe('Get UI repeat timer', () => {
    it('should be get UI repeat timer success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiRepeatTimerDto =
        typia.random<CreateUiRepeatTimerDto>();

      const createResponse = await RepeatTimerAPI.createUiRepeatTimer(
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

      const uiRepeatTimer = createResponse.data;

      const getResponse = await RepeatTimerAPI.getUiRepeatTimer(
        {
          host,
          headers: { LmsSecret },
        },
        uiRepeatTimer.ui.uiComponentId,
      );
      if (!getResponse.success) {
        const message = JSON.stringify(getResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const fetchedUiRepeatTimer = getResponse.data;
      if (!fetchedUiRepeatTimer) {
        throw new Error('assert');
      }

      expect(fetchedUiRepeatTimer.ui.title).toEqual(uiRepeatTimer.ui.title);
    });
  });

  describe('Update UI repeat timer', () => {
    it('should be update UI repeat timer success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const randomCreateDto = typia.random<CreateUiRepeatTimerDto>();
      const createDto: CreateUiRepeatTimerDto = {
        ...randomCreateDto,
        ui: {
          ...randomCreateDto.ui,
          description: 'MOCK',
        },
      };
      const createResponse = await RepeatTimerAPI.createUiRepeatTimer(
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

      const uiRepeatTimer = createResponse.data;
      const updateDto: UpdateUiRepeatTimerDto = {
        ...uiRepeatTimer,
        ui: {
          ...uiRepeatTimer.ui,
          description: 'TEST',
        },
      };

      const updateResponse = await RepeatTimerAPI.updateUiRepeatTimer(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        uiRepeatTimer.ui.uiComponentId,
        updateDto,
      );
      if (!updateResponse.success) {
        const message = JSON.stringify(updateResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const updatedUiRepeatTimer = updateResponse.data;
      expect(updatedUiRepeatTimer.ui.title).toEqual(updateDto.ui?.title);
      expect(updatedUiRepeatTimer.ui.description).toEqual('TEST');
      expect(uiRepeatTimer.ui.id).toEqual(updatedUiRepeatTimer.ui.id);
    });
  });

  describe('Delete UI repeat timer', () => {
    it('should be delete UI repeat timer success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const createDto: CreateUiRepeatTimerDto =
        typia.random<CreateUiRepeatTimerDto>();

      const createResponse = await RepeatTimerAPI.createUiRepeatTimer(
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

      const uiRepeatTimer = createResponse.data;

      const deleteResponse = await UiComponentAPI.deleteUiComponent(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        uiRepeatTimer.ui.uiComponentId,
      );
      if (!deleteResponse.success) {
        const message = JSON.stringify(deleteResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const deletedUiComponent = deleteResponse.data;
      expect(deletedUiComponent.uiComponentId).toEqual(
        uiRepeatTimer.ui.uiComponentId,
      );

      // GET result after delete
      const afterDeleteResponse = await RepeatTimerAPI.getUiRepeatTimer(
        {
          host,
          headers: { LmsSecret },
        },
        uiRepeatTimer.ui.uiComponentId,
      );
      if (!afterDeleteResponse.success) {
        const message = JSON.stringify(afterDeleteResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      expect(afterDeleteResponse.data).toBeNull();
    });
  });
});
