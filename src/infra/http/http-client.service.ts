import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IHttpClient } from './http-client.interface';
import { IHttpHeaders } from './http-client.types';

@Injectable()
export class HttpClientService implements IHttpClient {
  private readonly logger = new Logger(HttpClientService.name);
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, headers: IHttpHeaders = {}): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<T>(url, {
          headers: {
            ...headers,
          },
        })
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        ),
    );

    return data;
  }

  async post<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<T>(url, body, {
          headers: {
            ...headers,
          },
        })
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        ),
    );

    return data;
  }

  async put<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    const { data } = await firstValueFrom(
      this.httpService
        .put<T>(url, body, {
          headers: {
            ...headers,
          },
        })
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        ),
    );

    return data;
  }

  async patch<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch<T>(url, body, {
          headers: {
            ...headers,
          },
        })
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        ),
    );

    return data;
  }

  async delete<T>(url: string, headers: IHttpHeaders = {}) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<T>(url, {
          headers: {
            ...headers,
          },
        })
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            throw err;
          }),
        ),
    );

    return data;
  }
}
