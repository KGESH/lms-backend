import BigNumber from 'bignumber.js';
import * as typia from 'typia';
import { Price } from '@src/shared/types/primitive';

export const isSame = (a: number | string, b: number | string): boolean => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return x.eq(y);
};

export const gt = (a: number | string, b: number | string): boolean => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return x.gt(y);
};

export const lt = (a: number | string, b: number | string): boolean => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return x.lt(y);
};

export const plus = (a: number | string, b: number | string): Price => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return typia.assert<Price>(x.plus(y).toString());
};

export const minus = (a: number | string, b: number | string): Price => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return typia.assert<Price>(x.minus(y).toString());
};

export const multiply = (a: number | string, b: number | string): Price => {
  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return typia.assert<Price>(x.multipliedBy(y).toString());
};

export const divide = (a: number | string, b: number | string): Price => {
  if (b === '0' || b === 0) {
    throw new Error('Division by zero');
  }

  const x = new BigNumber(a);
  const y = new BigNumber(b);
  return typia.assert<Price>(x.dividedBy(y).toString());
};
