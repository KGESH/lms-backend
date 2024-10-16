import { Uuid } from '@src/shared/types/primitive';
import { IUiComponent } from '@src/v1/ui/component/ui-component.interface';
import { UiPopup } from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

export type IUiPopup = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  metadata: string | null;
  json: Record<string, unknown>;
};

export type IUiPopupComponent = IUiComponent<UiPopup, IUiPopup>;

export type IUiPopupComponentCreate = Optional<
  IUiComponent<UiPopup, Optional<IUiPopup, 'id' | 'uiComponentId'>>,
  'id'
>;

export type IUiPopupComponentUpdate = Partial<IUiPopupComponent>;
