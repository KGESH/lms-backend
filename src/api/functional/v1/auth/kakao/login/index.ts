/**
 * @packageDocumentation
 * @module api.functional.v1.auth.kakao.login
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type {
  IConnection,
  Primitive,
  IPropagation,
  Resolved,
  HttpError,
} from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { ExcludePassword } from "../../../../../../shared/types/omit-password";
import type { KakaoLoginDto } from "../../../../../../v1/auth/kakao-auth.dto";
import type { UserDto } from "../../../../../../v1/user/user.dto";

/**
 * @controller AuthController.kakaoLogin
 * @path POST /v1/auth/kakao/login
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function kakaoLogin(
  connection: IConnection,
  body: kakaoLogin.Input,
): Promise<kakaoLogin.Output> {
  typia.assert<typeof body>(body);
  return !!connection.simulate
    ? kakaoLogin.simulate(connection, body)
    : PlainFetcher.propagate(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...kakaoLogin.METADATA,
          template: kakaoLogin.METADATA.path,
          path: kakaoLogin.path(),
        },
        body,
      );
}
export namespace kakaoLogin {
  export type Input = Primitive<KakaoLoginDto>;
  export type Output = IPropagation<{
    201: ExcludePassword<UserDto>;
  }>;

  export const METADATA = {
    method: "POST",
    path: "/v1/auth/kakao/login",
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

  export const path = () => "/v1/auth/kakao/login";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<ExcludePassword<UserDto>>> =>
    typia.random<Primitive<ExcludePassword<UserDto>>>(g);
  export const simulate = (
    connection: IConnection,
    body: kakaoLogin.Input,
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
