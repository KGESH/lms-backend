import BigNumber from 'bignumber.js';

export const isSame = (a: number | string, b: number | string): boolean => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return x.eq(y);
};
