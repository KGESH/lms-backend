import { IUiPopupComponent } from '@src/v1/ui/component/popup/ui-popup.interface';
import { UiPopupDto } from '@src/v1/ui/component/popup/ui-popup.dto';
import * as date from '@src/shared/utils/date';

export const uiPopupToDto = (uiPopup: IUiPopupComponent): UiPopupDto => {
  return {
    ...uiPopup,
    ui: {
      ...uiPopup.ui,
      createdAt: date.toISOString(uiPopup.ui.createdAt),
      updatedAt: date.toISOString(uiPopup.ui.updatedAt),
      deletedAt: date.toIsoStringOrNull(uiPopup.ui.deletedAt),
    },
  };
};
