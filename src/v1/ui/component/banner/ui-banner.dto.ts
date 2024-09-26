import { Uuid } from '@src/shared/types/primitive';
import { UiComponentDto } from '@src/v1/ui/component/ui-component.dto';
import { UiBanner } from '@src/v1/ui/category/ui-category.interface';

export type UiBannerDto = UiComponentDto<
  UiBanner,
  {
    id: Uuid;
    uiComponentId: Uuid;
    title: string;
    description: string | null;
    linkUrl: string | null;
  }
>;

export type CreateUiBannerDto = Omit<
  UiBannerDto,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Omit<UiBannerDto['ui'], 'id' | 'uiComponentId'>;
};

export type UpdateUiBannerDto = Partial<CreateUiBannerDto>;

export type DeletedUiBannerDto = {
  id: Uuid;
};
