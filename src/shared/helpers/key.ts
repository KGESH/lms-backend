import * as typia from 'typia';

export const formatPrivateKey = (key: string): string => {
  const privateKey = typia.assert<string>(key);

  const begin = '-----BEGIN PRIVATE KEY-----';
  const end = '-----END PRIVATE KEY-----';
  const keyStr = privateKey.replace(begin, '').replace(end, '');
  const trimmedKey = keyStr.replace(/(\r\n|\n|\r)/gm, '');
  const formattedKey = `${begin}\n${trimmedKey}\n${end}`;

  return formattedKey;
};
