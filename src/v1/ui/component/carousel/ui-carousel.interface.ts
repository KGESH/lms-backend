import { Uuid } from '@src/shared/types/primitive';
import { IUiComponent } from '@src/v1/ui/component/ui-component.interface';
import {
  UiCarousel,
  UiCarouselType,
} from '@src/v1/ui/category/ui-category.interface';
import { Optional } from '@src/shared/types/optional';

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
  Omit<IUiCarouselComponent<T>, 'ui' | 'id'> & {
    ui: Partial<Omit<IUiCarouselComponent<T>['ui'], 'id' | 'uiComponentId'>>;
  }
>;
