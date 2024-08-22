import * as typia from 'typia';
import { Uuid } from '@src/shared/types/primitive';

export const createUuid = typia.createRandom<Uuid>();
