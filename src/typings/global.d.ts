import { IEnvironment } from '../configs/configs.types';

export declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnvironment {}
  }
}
