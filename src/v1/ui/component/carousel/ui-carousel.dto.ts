import { UiComponentDto } from '../ui-component.dto';
import { Uuid } from '../../../../shared/types/primitive';
import {
  UiCarousel,
  UiCarouselType,
} from '../../category/ui-category.interface';

export type UiCarouselDto<T extends UiCarouselType> = UiComponentDto<
  UiCarousel,
  {
    id: Uuid;
    uiComponentId: Uuid;
    carouselType: T;
    title: string;
    description: string | null;
  }
>;

export type CreateUiCarouselDto<T extends UiCarouselType> = Omit<
  UiCarouselDto<T>,
  'id' | 'uiComponentId' | 'ui'
> & {
  ui: Omit<UiCarouselDto<T>['ui'], 'id' | 'uiComponentId'>;
};

export type UpdateUiCarouselDto<T extends UiCarouselType> = Partial<
  UiCarouselDto<T>
>;
