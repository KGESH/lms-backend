import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * @description
 * E164 format의 전화번호를 지역 번호 형식으로 변환합니다.
 * +821012345678 -> 01012345678
 */
export const localizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber.startsWith('+')) {
    // Todo: refactor
    // throw new Error('Invalid E164 format phone number');
    return phoneNumber;
  }

  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  const formatted = parsedPhoneNumber.formatNational(); // parsePhoneNumber('+821012345678').formatNational() === '(010) 1234-5678'
  const replaced = formatted.replace(/\D/g, ''); // Remove all non-numeric characters
  return replaced;
};
