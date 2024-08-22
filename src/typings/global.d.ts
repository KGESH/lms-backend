import { IEnvironment } from '@src/configs/configs.types';

export declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnvironment {}
  }
}
