import { Injectable } from '@nestjs/common';
import { UiCraftRepository } from '@src/v1/ui/craft/ui-craft.repository';
import { UiCraftQueryRepository } from '@src/v1/ui/craft/ui-craft-query.repository';
import {
  IUiCraftComponent,
  IUiCraftComponentCreate,
} from '@src/v1/ui/craft/ui-craft.interface';

@Injectable()
export class UiCraftService {
  constructor(
    private readonly uiCraftRepository: UiCraftRepository,
    private readonly uiCraftQueryRepository: UiCraftQueryRepository,
  ) {}

  async createCraftComponent(
    params: IUiCraftComponent,
  ): Promise<IUiCraftComponent> {
    return await this.uiCraftRepository.createCraftUiComponent(params);
  }

  async updateCraftComponent(
    where: Pick<IUiCraftComponent, 'id'>,
    params: IUiCraftComponent,
  ): Promise<IUiCraftComponent> {
    return await this.uiCraftRepository.updateCraftUiComponent(where, params);
  }

  async upsertCraftComponent(
    params: IUiCraftComponentCreate,
  ): Promise<IUiCraftComponent> {
    const alreadyExist = await this.findCraftComponentByPath(params);

    if (alreadyExist) {
      return await this.uiCraftRepository.updateCraftUiComponent(
        { id: alreadyExist.id },
        params,
      );
    }

    return await this.uiCraftRepository.createCraftUiComponent(params);
  }

  async findCraftComponentByPath(
    where: Pick<IUiCraftComponent, 'path'>,
  ): Promise<IUiCraftComponent | null> {
    return await this.uiCraftQueryRepository.findCraftUiComponentByPath(where);
  }
}
