import { Uuid } from '@src/shared/types/primitive';
import { IUiComponent } from '@src/v1/ui/component/ui-component.interface';
import { UiMarketingBanner } from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

export type IUiMarketingBanner = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  linkUrl: string | null;
};

export type IUiMarketingBannerComponent = IUiComponent<
  UiMarketingBanner,
  IUiMarketingBanner
>;

export type IUiMarketingBannerComponentCreate = Optional<
  IUiComponent<
    UiMarketingBanner,
    Optional<IUiMarketingBanner, 'id' | 'uiComponentId'>
  >,
  'id'
>;

export type IUiMarketingBannerComponentUpdate =
  Partial<IUiMarketingBannerComponent>;
