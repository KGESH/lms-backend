import { UInt, Uuid } from '@src/shared/types/primitive';
import { IUiComponent } from '@src/v1/ui/component/ui-component.interface';
import { UiRepeatTimer } from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

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

export type IUiRepeatTimerComponentCreate = Optional<
  IUiComponent<UiRepeatTimer, Optional<IUiRepeatTimer, 'id' | 'uiComponentId'>>,
  'id'
>;

export type IUiRepeatTimerComponentUpdate = Partial<IUiRepeatTimerComponent>;
