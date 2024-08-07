import { UInt, Uuid } from '../../../../shared/types/primitive';
import { UiComponentDto } from '../ui-component.dto';

export type UiRepeatTimerDto = UiComponentDto<{
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  repeatMinutes: UInt;
  buttonLabel: string | null;
  buttonHref: string | null;
}>;

export type CreateUiRepeatTimerDto = Pick<
  UiRepeatTimerDto,
  'category' | 'name' | 'sequence' | 'description' | 'ui'
>;

export type UpdateUiRepeatTimerDto = Partial<UiRepeatTimerDto>;

export type DeletedUiRepeatTimerDto = {
  id: Uuid;
};
