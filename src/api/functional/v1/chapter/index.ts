/**
 * @packageDocumentation
 * @module api.functional.v1.chapter
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type {
  IConnection,
  IPropagation,
  Primitive,
  Resolved,
  HttpError,
} from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { TypeGuardError } from "typia/lib/TypeGuardError";

import type { Uuid } from "../../../../shared/types/primitive";
import type { IErrorResponse } from "../../../../shared/types/response";
import type {
  ChapterDto,
  ChapterCreateDto,
} from "../../../../v1/course/chapter/chapter.dto";

/**
 * @controller ChapterController.getChapters
 * @path GET /v1/chapter
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getChapters(
  connection: IConnection,
): Promise<getChapters.Output> {
  return !!connection.simulate
    ? getChapters.simulate(connection)
    : PlainFetcher.propagate(connection, {
        ...getChapters.METADATA,
        template: getChapters.METADATA.path,
        path: getChapters.path(),
      });
}
export namespace getChapters {
  export type Output = IPropagation<{
    200: Array<ChapterDto>;
  }>;

  export const METADATA = {
    method: "GET",
    path: "/v1/chapter",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = () => "/v1/chapter";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<Array<ChapterDto>>> =>
    typia.random<Primitive<Array<ChapterDto>>>(g);
  export const simulate = (connection: IConnection): Output => {
    return {
      success: true,
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      data: random(
        "object" === typeof connection.simulate && null !== connection.simulate
          ? connection.simulate
          : undefined,
      ),
    };
  };
}

/**
 * @throws 400 invalid request
 * @controller ChapterController.getChapter
 * @path GET /v1/chapter/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getChapter(
  connection: IConnection,
  id: Uuid,
): Promise<getChapter.Output> {
  typia.assert<typeof id>(id);
  return !!connection.simulate
    ? getChapter.simulate(connection, id)
    : PlainFetcher.propagate(connection, {
        ...getChapter.METADATA,
        template: getChapter.METADATA.path,
        path: getChapter.path(id),
      });
}
export namespace getChapter {
  export type Output = IPropagation<{
    200: null | ChapterDto;
    400: TypeGuardError<any>;
  }>;

  export const METADATA = {
    method: "GET",
    path: "/v1/chapter/:id",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: Uuid) =>
    `/v1/chapter/${encodeURIComponent(id ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<null | ChapterDto>> =>
    typia.random<Primitive<null | ChapterDto>>(g);
  export const simulate = (connection: IConnection, id: Uuid): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    try {
      assert.param("id")(() => typia.assert(id));
    } catch (exp) {
      if (!typia.is<HttpError>(exp)) throw exp;
      return {
        success: false,
        status: exp.status,
        headers: exp.headers,
        data: exp.toJSON().message,
      } as any;
    }
    return {
      success: true,
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      data: random(
        "object" === typeof connection.simulate && null !== connection.simulate
          ? connection.simulate
          : undefined,
      ),
    };
  };
}

/**
 * @throws 400 invalid request
 * @throws 404 course not found
 * @controller ChapterController.createChapter
 * @path POST /v1/chapter
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function createChapter(
  connection: IConnection,
  body: createChapter.Input,
): Promise<createChapter.Output> {
  typia.assert<typeof body>(body);
  return !!connection.simulate
    ? createChapter.simulate(connection, body)
    : PlainFetcher.propagate(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...createChapter.METADATA,
          template: createChapter.METADATA.path,
          path: createChapter.path(),
        },
        body,
      );
}
export namespace createChapter {
  export type Input = Primitive<ChapterCreateDto>;
  export type Output = IPropagation<{
    201: ChapterDto;
    400: TypeGuardError<any>;
    404: IErrorResponse<404>;
  }>;

  export const METADATA = {
    method: "POST",
    path: "/v1/chapter",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = () => "/v1/chapter";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<ChapterDto>> => typia.random<Primitive<ChapterDto>>(g);
  export const simulate = (
    connection: IConnection,
    body: createChapter.Input,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(),
      contentType: "application/json",
    });
    try {
      assert.body(() => typia.assert(body));
    } catch (exp) {
      if (!typia.is<HttpError>(exp)) throw exp;
      return {
        success: false,
        status: exp.status,
        headers: exp.headers,
        data: exp.toJSON().message,
      } as any;
    }
    return {
      success: true,
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
      data: random(
        "object" === typeof connection.simulate && null !== connection.simulate
          ? connection.simulate
          : undefined,
      ),
    };
  };
}

/**
 * @throws 400 invalid request
 * @throws 404 chapter not found
 * @controller ChapterController.updateChapter
 * @path PATCH /v1/chapter/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function updateChapter(
  connection: IConnection,
  id: Uuid,
  body: updateChapter.Input,
): Promise<updateChapter.Output> {
  typia.assert<typeof id>(id);
  typia.assert<typeof body>(body);
  return !!connection.simulate
    ? updateChapter.simulate(connection, id, body)
    : PlainFetcher.propagate(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...updateChapter.METADATA,
          template: updateChapter.METADATA.path,
          path: updateChapter.path(id),
        },
        body,
      );
}
export namespace updateChapter {
  export type Input = Primitive<Partial<ChapterDto>>;
  export type Output = IPropagation<{
    200: ChapterDto;
    400: TypeGuardError<any>;
    404: IErrorResponse<404>;
  }>;

  export const METADATA = {
    method: "PATCH",
    path: "/v1/chapter/:id",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: Uuid) =>
    `/v1/chapter/${encodeURIComponent(id ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<ChapterDto>> => typia.random<Primitive<ChapterDto>>(g);
  export const simulate = (
    connection: IConnection,
    id: Uuid,
    body: updateChapter.Input,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    try {
      assert.param("id")(() => typia.assert(id));
      assert.body(() => typia.assert(body));
    } catch (exp) {
      if (!typia.is<HttpError>(exp)) throw exp;
      return {
        success: false,
        status: exp.status,
        headers: exp.headers,
        data: exp.toJSON().message,
      } as any;
    }
    return {
      success: true,
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      data: random(
        "object" === typeof connection.simulate && null !== connection.simulate
          ? connection.simulate
          : undefined,
      ),
    };
  };
}

/**
 * @throws 400 invalid request
 * @throws 404 chapter not found
 * @controller ChapterController.deleteChapter
 * @path DELETE /v1/chapter/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function deleteChapter(
  connection: IConnection,
  id: Uuid,
): Promise<deleteChapter.Output> {
  typia.assert<typeof id>(id);
  return !!connection.simulate
    ? deleteChapter.simulate(connection, id)
    : PlainFetcher.propagate(connection, {
        ...deleteChapter.METADATA,
        template: deleteChapter.METADATA.path,
        path: deleteChapter.path(id),
      });
}
export namespace deleteChapter {
  export type Output = IPropagation<{
    200: ChapterDto;
    400: TypeGuardError<any>;
    404: IErrorResponse<404>;
  }>;

  export const METADATA = {
    method: "DELETE",
    path: "/v1/chapter/:id",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (id: Uuid) =>
    `/v1/chapter/${encodeURIComponent(id ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<ChapterDto>> => typia.random<Primitive<ChapterDto>>(g);
  export const simulate = (connection: IConnection, id: Uuid): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    try {
      assert.param("id")(() => typia.assert(id));
    } catch (exp) {
      if (!typia.is<HttpError>(exp)) throw exp;
      return {
        success: false,
        status: exp.status,
        headers: exp.headers,
        data: exp.toJSON().message,
      } as any;
    }
    return {
      success: true,
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      data: random(
        "object" === typeof connection.simulate && null !== connection.simulate
          ? connection.simulate
          : undefined,
      ),
    };
  };
}
