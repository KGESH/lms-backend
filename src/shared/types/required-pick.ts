import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';

/**
 * @description
 * T 타입의 특정 속성을 Pick한후, requried type으로 만듭니다.
 *
 * @example
 * type Category = {
 *   id: Uuid;
 *   name: string;
 *   parentId: Uuid | null;
 *   description: string | null;
 * };
 *
 * type RequiredParentIdCategory = RequiredPick<Category, 'parentId'>;
 * // {
 * //  parentId: Uuid;
 * // }
 */
export type RequiredPick<T, K extends keyof T> = NonNullableInfer<Pick<T, K>>;
