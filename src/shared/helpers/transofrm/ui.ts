import { UiComponents } from '@src/v1/ui/component/ui-component-group.dto';
import { IUiComponents } from '@src/v1/ui/component/ui-component-group.interface';
import { uiPopupToDto } from '@src/shared/helpers/transofrm/popup';

export const uiComponentGroupToDto = (
  uiComponentGroup: IUiComponents,
): UiComponents => {
  return {
    ...uiComponentGroup,
    popups: uiComponentGroup.popups.map(uiPopupToDto),
  };
};
