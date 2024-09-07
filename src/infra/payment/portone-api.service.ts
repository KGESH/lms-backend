import { Injectable } from '@nestjs/common';
import { HttpClientService } from '@src/infra/http/http-client.service';
import { IHttpHeaders } from '@src/infra/http/http-client.types';
import { ConfigsService } from '@src/configs/configs.service';

@Injectable()
export class PortoneApiService {
  constructor(
    private readonly http: HttpClientService,
    private readonly configsService: ConfigsService,
  ) {}

  async get<T>(url: string, headers: IHttpHeaders = {}) {
    return await this.http.get<T>(url, {
      ...headers,
      Authorization: `PortOne ${this.configsService.env.PORTONE_API_SECRET}`,
    });
  }

  async post<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    return await this.http.post<T>(url, body, {
      ...headers,
      Authorization: `PortOne ${this.configsService.env.PORTONE_API_SECRET}`,
    });
  }

  async put<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    return await this.http.put<T>(url, body, {
      ...headers,
      Authorization: `PortOne ${this.configsService.env.PORTONE_API_SECRET}`,
    });
  }

  async patch<T>(url: string, body: unknown, headers: IHttpHeaders = {}) {
    return await this.http.patch<T>(url, body, {
      ...headers,
      Authorization: `PortOne ${this.configsService.env.PORTONE_API_SECRET}`,
    });
  }

  async delete<T>(url: string, headers: IHttpHeaders = {}) {
    return await this.http.delete<T>(url, {
      ...headers,
      Authorization: `PortOne ${this.configsService.env.PORTONE_API_SECRET}`,
    });
  }
}
