type HeaderValue = string | string[] | number | boolean | null;

type RawHeaders = {
  [key: string]: HeaderValue;
};

export type IHttpHeaders = RawHeaders;
