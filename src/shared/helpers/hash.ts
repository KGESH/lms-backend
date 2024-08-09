import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hash = async (rawValue: string): Promise<string> => {
  return bcrypt.hash(rawValue, SALT_ROUNDS);
};

type CompareHashFn = (params: {
  rawValue: string;
  hash: string;
}) => Promise<boolean>;
export const compareHash: CompareHashFn = async ({ rawValue, hash }) => {
  return bcrypt.compare(rawValue, hash);
};
