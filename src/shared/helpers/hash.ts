import * as Argon2 from '@node-rs/argon2';

export const hash = async (rawValue: string): Promise<string> => {
  return await Argon2.hash(rawValue);
};

type CompareHashFn = (params: {
  rawValue: string;
  hash: string;
}) => Promise<boolean>;
export const compareHash: CompareHashFn = async ({ rawValue, hash }) => {
  return await Argon2.verify(hash, rawValue);
};
