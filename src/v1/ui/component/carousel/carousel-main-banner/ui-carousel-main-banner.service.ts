import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UiCarouselComponentRepository } from '@src/v1/ui/component/carousel/ui-carousel-component.repository';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
  IUiCarouselComponentUpdate,
} from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselMainBanner } from '@src/v1/ui/category/ui-category.interface';
import { UiCarouselComponentQueryRepository } from '@src/v1/ui/component/carousel/ui-carousel-component-query.repository';
import {
  IUiCarouselContent,
  IUiCarouselContentCreate,
  IUiCarouselContentUpdate,
} from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';
import { UiCarouselContentService } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.service';
import { UiCarouselMainBannerQueryRepository } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner-query.repository';

@Injectable()
export class UiCarouselMainBannerService {
  constructor(
    private readonly uiCarouselContentService: UiCarouselContentService,
    private readonly uiCarouselComponentRepository: UiCarouselComponentRepository<UiCarouselMainBanner>,
    private readonly uiCarouselMainBannerComponentQueryRepository: UiCarouselComponentQueryRepository<UiCarouselMainBanner>,
    private readonly uiCarouselMainBannerQueryRepository: UiCarouselMainBannerQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findUiCarouselMainBannerWithContents(
    where: Pick<
      IUiCarouselComponent<UiCarouselMainBanner>['ui'],
      'uiComponentId'
    >,
  ): Promise<IUiCarouselMainBannerWithContents | null> {
    const carouselWithItems =
      await this.uiCarouselMainBannerQueryRepository.findCarouselMainBannerWithContents(
        where,
      );

    return carouselWithItems;
  }

  async createUiCarouselMainBanner(
    carouselParams: IUiCarouselComponentCreate<UiCarouselMainBanner>,
    carouselContentParams: Omit<IUiCarouselContentCreate, 'uiCarouselId'>[],
  ): Promise<IUiCarouselMainBannerWithContents> {
    const { uiCarousel, contents } = await this.drizzle.db.transaction(
      async (tx) => {
        const uiCarousel =
          await this.uiCarouselComponentRepository.createUiCarouselComponent(
            carouselParams,
            tx,
          );
        const contents =
          await this.uiCarouselContentService.createUiCarouselContents(
            carouselContentParams.map(
              (params) => ({
                ...params,
                uiCarouselId: uiCarousel.ui.id,
              }),
              tx,
            ),
          );

        return { uiCarousel, contents };
      },
    );

    return { uiCarousel, contents };
  }

  async createUiCarouselMainBannerItems(
    where: Pick<
      IUiCarouselComponent<UiCarouselMainBanner>['ui'],
      'uiComponentId'
    >,
    createManyParams: Omit<IUiCarouselContentCreate, 'uiCarouselId'>[],
  ): Promise<IUiCarouselContent[]> {
    const carousel =
      await this.uiCarouselMainBannerComponentQueryRepository.findUiCarousel(
        where,
      );

    if (!carousel) {
      throw new NotFoundException('UI Review carousel not found.');
    }

    const contents =
      await this.uiCarouselContentService.createUiCarouselContents(
        createManyParams.map((params) => ({
          ...params,
          uiCarouselId: carousel.ui.id,
        })),
      );

    return contents;
  }

  async updateUiCarouselMainBanner(
    where: Pick<
      IUiCarouselComponent<UiCarouselMainBanner>['ui'],
      'uiComponentId'
    >,
    params: IUiCarouselComponentUpdate<UiCarouselMainBanner>,
  ): Promise<IUiCarouselComponent<UiCarouselMainBanner>> {
    const carousel =
      await this.uiCarouselMainBannerComponentQueryRepository.findUiCarousel(
        where,
      );

    if (!carousel) {
      throw new NotFoundException('UI Review carousel not found.');
    }

    const updatedCarousel =
      await this.uiCarouselComponentRepository.updateUiCarouselComponent(
        { id: carousel.ui.id, uiComponentId: carousel.ui.uiComponentId },
        params,
      );

    return updatedCarousel;
  }

  async updateUiCarouselMainBannerItem(
    where: Pick<IUiCarouselContent, 'id'>,
    params: Omit<IUiCarouselContentUpdate, 'id'>,
  ): Promise<IUiCarouselContent> {
    const updatedCarouselContent =
      await this.uiCarouselContentService.updateUiCarouselContent(
        where,
        params,
      );

    return updatedCarouselContent;
  }

  async deleteUiCarouselMainBannerItems(
    ids: IUiCarouselContent['id'][],
  ): Promise<IUiCarouselContent['id'][]> {
    const deletedIds = await this.drizzle.db.transaction(async (tx) => {
      return await this.uiCarouselContentService.deleteUiCarouselContents(
        ids,
        tx,
      );
    });

    return deletedIds;
  }
}
