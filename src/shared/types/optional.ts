export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type OptionalPick<T, K extends keyof T> = Partial<Pick<T, K>>;
