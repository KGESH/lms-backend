import { HttpError } from '@nestia/fetcher';
import * as typia from 'typia';

/**
 * @description
 * Nestia fetcher exception converter.
 * HttpError -> T (JSON)
 */
export const convertException = <T>(e: HttpError): T => {
  const isNestiaHttpError = typia.is<HttpError>(e);

  if (!isNestiaHttpError) {
    throw new Error('Invalid exception type');
  }

  const errorResponse = (e as HttpError).toJSON<T>();
  const json: T = errorResponse.message;
  return json;
};
