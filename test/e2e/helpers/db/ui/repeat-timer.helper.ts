import { dbSchema } from '../../../../../src/infra/db/schema';
import { IUiRepeatTimerComponentCreate } from '../../../../../src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import * as typia from 'typia';

export const createUiRepeatTimer = async (
  params: IUiRepeatTimerComponentCreate,
  db: TransactionClient,
) => {
  const { ui: uiCreateParam, ...uiComponentCreateParam } = params;
  const [uiComponent] = await db
    .insert(dbSchema.uiComponents)
    .values(uiComponentCreateParam)
    .returning();
  await db.insert(dbSchema.uiRepeatTimers).values({
    ...uiCreateParam,
    uiComponentId: uiComponent.id,
  });
};

export const seedUiRepeatTimer = async (db: TransactionClient) => {
  const params: IUiRepeatTimerComponentCreate = {
    ...typia.random<IUiRepeatTimerComponentCreate>(),
  };

  await createUiRepeatTimer(params, db);
};
