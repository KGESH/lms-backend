import { Uuid } from '@src/shared/types/primitive';
import { UiComponentDto } from '@src/v1/ui/component/ui-component.dto';
import { UiPopup } from '@src/v1/ui/category/ui-category.interface';

export type UiPopupDto = UiComponentDto<
  UiPopup,
  {
    id: Uuid;
    uiComponentId: Uuid;
    title: string;
    richTextContent: string;
    buttonLabel: string | null;
    linkUrl: string | null;
  }
>;

export type CreateUiPopupDto = Omit<
  UiPopupDto,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Omit<UiPopupDto['ui'], 'id' | 'uiComponentId'>;
};

export type UpdateUiPopupDto = Partial<UiPopupDto>;

export type DeletedUiPopupDto = {
  id: Uuid;
};
