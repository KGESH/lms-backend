import { UiCraftStatus, Uuid } from '@src/shared/types/primitive';

export type IUiCraftComponent = {
  id: Uuid;
  name: string;
  description: string | null;
  serializedJson: string;
  path: string;
  status: UiCraftStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IUiCraftComponentCreate = Omit<
  IUiCraftComponent,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUiCraftComponentUpdate = Partial<IUiCraftComponentCreate>;
