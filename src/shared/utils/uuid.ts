import * as typia from 'typia';
import { Uuid } from '../types/primitive';

export const createUuid = typia.createRandom<Uuid>();
