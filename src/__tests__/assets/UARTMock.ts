import { uart } from '@espruino-tools/uart';

export const UartMock = {
  ...uart,
  write: (code: string) => {
    UartMock.writtenData = code;
  },
  eval: (code: string) => {
    UartMock.writtenData = code;
  },
  writtenData: '',
  debug: 0,
};
