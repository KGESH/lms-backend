import { ISO8601, Uuid } from '@src/shared/types/primitive';

export type UiCraftComponentDto = {
  id: Uuid;
  name: string;
  description: string | null;
  serializedJson: string;
  path: string;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type UiCraftComponentUpsertDto = Omit<
  UiCraftComponentDto,
  'id' | 'createdAt' | 'updatedAt'
>;
