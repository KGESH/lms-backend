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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IUiPopupComponent = IUiComponent<UiPopup, IUiPopup>;

export type IUiPopupComponentCreate = Optional<
  IUiComponent<
    UiPopup,
    Omit<
      Optional<IUiPopup, 'id' | 'uiComponentId'>,
      'createdAt' | 'updatedAt' | 'deletedAt'
    >
  >,
  'id'
>;

export type IUiPopupComponentUpdate = Partial<IUiPopupComponentCreate>;
