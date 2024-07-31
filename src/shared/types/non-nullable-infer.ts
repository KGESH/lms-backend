/**
 * @description
 * T 타입의 모든 속성에서 null을 제거합니다.
 *
 * @example
 * type Category = {
 *   id: Uuid;
 *   name: string;
 *   parentId: Uuid | null;
 *   description: string | null;
 * };
 *
 * type NonNullableCategory = NonNullableInfer<Category>;
 * // {
 * //  id: Uuid;
 * //  name: string;
 * //  parentId: Uuid;
 * //  description: string;
 * // }
 */
export type NonNullableInfer<T extends Record<string, any>> = {
  [K in keyof T]: NonNullable<T[K]>;
};
