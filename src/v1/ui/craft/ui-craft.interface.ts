import { Uuid } from '@src/shared/types/primitive';

export type IUiCraftComponent = {
  id: Uuid;
  name: string;
  description: string | null;
  serializedJson: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUiCraftComponentCreate = Omit<
  IUiCraftComponent,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IUiCraftComponentUpdate = Partial<IUiCraftComponentCreate>;
