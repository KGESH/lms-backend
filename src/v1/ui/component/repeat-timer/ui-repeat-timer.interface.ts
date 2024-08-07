import { UInt, Uuid } from '../../../../shared/types/primitive';
import { IUiComponent } from '../ui-component.interface';
import { UiRepeatTimer } from '../../category/ui-category.interface';

export type IUiRepeatTimer = {
  id: Uuid;
  uiComponentId: Uuid;
  title: string;
  description: string | null;
  repeatMinutes: UInt;
  buttonLabel: string | null;
  buttonHref: string | null;
};

export type IUiRepeatTimerComponent = IUiComponent<
  UiRepeatTimer,
  IUiRepeatTimer
>;

export type IUiRepeatTimerComponentCreate = Omit<IUiRepeatTimerComponent, 'id'>;

export type IUiRepeatTimerComponentUpdate = Partial<IUiRepeatTimerComponent>;
