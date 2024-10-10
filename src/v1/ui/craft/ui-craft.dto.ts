import { ISO8601, UiCraftStatus, Uuid } from '@src/shared/types/primitive';

export type UiCraftComponentDto = {
  id: Uuid;
  name: string;
  description: string | null;
  serializedJson: string;
  path: string;
  status: UiCraftStatus;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type UiCraftComponentUpsertDto = Omit<
  UiCraftComponentDto,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UiCraftCanvasQuery = {
  path: string;
};
