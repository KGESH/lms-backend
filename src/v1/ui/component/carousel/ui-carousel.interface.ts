import { Uuid } from '../../../../shared/types/primitive';
import { IUiComponent } from '../ui-component.interface';
import {
  UiCarousel,
  UiCarouselType,
} from '../../category/ui-category.interface';
import { Optional } from '../../../../shared/types/optional';

export type IUiCarousel<T extends UiCarouselType> = {
  id: Uuid;
  uiComponentId: Uuid;
  carouselType: T;
  title: string;
  description: string | null;
};

export type IUiCarouselComponent<T extends UiCarouselType> = IUiComponent<
  UiCarousel,
  IUiCarousel<T>
>;

export type IUiCarouselComponentCreate<T extends UiCarouselType> = Optional<
  IUiComponent<UiCarousel, Optional<IUiCarousel<T>, 'id' | 'uiComponentId'>>,
  'id'
>;

export type IUiCarouselComponentUpdate<T extends UiCarouselType> = Partial<
  IUiCarouselComponent<T>
>;
