export type IResponse<T> = {
  data: T;
};

export type IErrorResponse = {
  statusCode: number;
  message: string;
  error: unknown;
};
