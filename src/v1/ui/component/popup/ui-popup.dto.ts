import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { UiComponentDto } from '@src/v1/ui/component/ui-component.dto';
import { UiPopup } from '@src/v1/ui/category/ui-category.interface';
import { Pagination } from '@src/shared/types/pagination';

type UiPopupBase = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  metadata: string | null;
  json: Record<string, unknown>;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type UiPopupDto = UiComponentDto<UiPopup, UiPopupBase>;

export type CreateUiPopupDto = Omit<
  UiPopupDto,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Pick<UiPopupBase, 'title' | 'description' | 'metadata' | 'json'>;
};

export type UpdateUiPopupDto = Partial<CreateUiPopupDto>;

export type DeletedUiPopupDto = {
  id: Uuid;
};

export type UiPopupQuery = Partial<Pagination>;
