import { Uuid } from '@src/shared/types/primitive';
import { IUiComponent } from '@src/v1/ui/component/ui-component.interface';
import { UiBanner } from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

export type IUiBanner = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  linkUrl: string | null;
};

export type IUiBannerComponent = IUiComponent<UiBanner, IUiBanner>;

export type IUiBannerComponentCreate = Optional<
  IUiComponent<UiBanner, Optional<IUiBanner, 'id' | 'uiComponentId'>>,
  'id'
>;

export type IUiBannerComponentUpdate = Partial<IUiBannerComponentCreate>;
