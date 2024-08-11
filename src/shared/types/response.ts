export type IResponse<T> = {
  data: T;
};

export type IErrorResponse<S extends number> = {
  statusCode: S;
  message: string;
  timestamp: string;
  path: string;
};
