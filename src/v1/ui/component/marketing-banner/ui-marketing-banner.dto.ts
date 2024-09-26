import { Uuid } from '@src/shared/types/primitive';
import { UiComponentDto } from '@src/v1/ui/component/ui-component.dto';
import { UiMarketingBanner } from '@src/v1/ui/category/ui-category.interface';

export type UiMarketingBannerDto = UiComponentDto<
  UiMarketingBanner,
  {
    id: Uuid;
    uiComponentId: Uuid;
    title: string;
    description: string | null;
    linkUrl: string | null;
  }
>;

export type CreateUiMarketingBannerDto = Omit<
  UiMarketingBannerDto,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Omit<UiMarketingBannerDto['ui'], 'id' | 'uiComponentId'>;
};

export type UpdateUiMarketingBannerDto = Partial<UiMarketingBannerDto>;

export type DeletedUiMarketingBannerDto = {
  id: Uuid;
};
