import { PositiveInt } from '@src/shared/types/primitive';

/**
 * Generate a random number string with the given number of digits.
 */
export const generateRandomNumberString = ({
  digits,
}: {
  digits: PositiveInt;
}): string => {
  const digit = Math.pow(10, digits - 1);
  return Math.floor(digit + Math.random() * (digit * 9)).toString();
};
