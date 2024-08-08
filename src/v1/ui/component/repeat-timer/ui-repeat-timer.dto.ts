import { UInt, Uuid } from '../../../../shared/types/primitive';
import { UiComponentDto } from '../ui-component.dto';
import { UiRepeatTimer } from '../../category/ui-category.interface';

export type UiRepeatTimerDto = UiComponentDto<
  UiRepeatTimer,
  {
    id: Uuid;
    uiComponentId: Uuid;
    title: string;
    description: string | null;
    repeatMinutes: UInt;
    buttonLabel: string | null;
    buttonHref: string | null;
  }
>;

export type CreateUiRepeatTimerDto = Omit<
  UiRepeatTimerDto,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Omit<UiRepeatTimerDto['ui'], 'id' | 'uiComponentId'>;
};

export type UpdateUiRepeatTimerDto = Partial<UiRepeatTimerDto>;

export type DeletedUiRepeatTimerDto = {
  id: Uuid;
};
