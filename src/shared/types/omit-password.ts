export type ExcludePassword<
  T extends { password: string } | { password: string | null },
> = Omit<T, 'password'>;

export type OmitPassword<T> = T extends
  | { password: string }
  | { password: string | null }
  ? ExcludePassword<T>
  : never;

/**
 * @description
 * 제거할 타입이 추가되면 아래와 같이 확장해서 사용.
 */
// export type ExcludeSecret<T extends { secret: string }> = Omit<T, 'secret'>;
//
// export type OmitPassword<T> = T extends
//   | { password: string }
//   | { password: string | null }
//   ? ExcludePassword<T>
//   : T extends { secret: string }
//     ? ExcludeSecret<T>
//     : never;
