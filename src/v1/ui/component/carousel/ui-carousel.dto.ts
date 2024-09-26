import { UiComponentDto } from '@src/v1/ui/component/ui-component.dto';
import { Uuid } from '@src/shared/types/primitive';
import {
  UiCarousel,
  UiCarouselType,
} from '@src/v1/ui/category/ui-category.interface';

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

// export type UpdateUiCarouselDto<T extends UiCarouselType> = Partial<
//   Omit<UiCarouselDto<T>, 'id' | 'uiComponentId' | 'ui'> & {
//     ui: Partial<Omit<UiCarouselDto<T>['ui'], 'id' | 'uiComponentId'>>;
//   }
// >;

export type UpdateUiCarouselDto<T extends UiCarouselType> = Partial<
  Omit<CreateUiCarouselDto<T>, 'ui'> & {
    ui: Partial<CreateUiCarouselDto<T>['ui']>;
  }
>;
