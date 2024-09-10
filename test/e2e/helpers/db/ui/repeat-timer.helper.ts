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

export const createManyUiRepeatTimer = async (
  createManyParams: IUiRepeatTimerComponentCreate[],
  db: TransactionClient,
) => {
  await Promise.all(
    createManyParams.map((params) => createUiRepeatTimer(params, db)),
  );
};

export const seedUiRepeatTimer = async (
  { count }: { count: number },
  db: TransactionClient,
  path?: string,
) => {
  const createManyParams = Array.from({ length: count }).map(() => ({
    ...typia.random<IUiRepeatTimerComponentCreate>(),
    path: path ? path : typia.random<string>(),
  }));

  await createManyUiRepeatTimer(createManyParams, db);
};
