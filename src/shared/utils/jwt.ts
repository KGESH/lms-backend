import { createSecretKey } from 'crypto';
import * as jose from 'jose';

export const signJwt = ({
  payload,
  expirationTime,
  jwtSecret,
}: {
  payload: Record<string, unknown>;
  jwtSecret: string;
  expirationTime: number | string | Date;
}): Promise<string> => {
  const secret = createSecretKey(jwtSecret, 'utf-8');
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret);
};

// Todo: typing
export const verifyJwt = ({
  token,
  jwtSecret,
}: {
  token: string;
  jwtSecret: string;
}) => {
  const secret = createSecretKey(jwtSecret, 'utf-8');
  return jose.jwtVerify(token, secret);
};
