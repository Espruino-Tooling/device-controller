import uart from 'espruino-ble-uart';
import { stringifyFunction } from './puck/helpers/funcToString';
import { IEspruinoTool } from './types/espruino-tool-types';

export class EspruinoTool implements IEspruinoTool {
  connected: boolean;
  UART: any;
  constructor() {
    this.connected = false;
    this.UART = uart;
  }
  upload(url: string): void {
    throw new Error('Method not implemented.');
  }
  eval(func: Function | string) {
    const promise = new Promise((resolve) => {
      let callback = (data: any) => {
        resolve(data);
      };

      this.UART.eval(
        typeof func == typeof Function
          ? stringifyFunction(func as Function)
          : func,
        callback,
      );
    }).catch((err) => {
      throw Error(err);
    });

    return promise;
  }
  async dump(): Promise<string> {
    let str: Promise<string> = (await this.eval(
      'E.dumpstr();\n',
    )) as Promise<string>;
    return str;
  }
  async getDeviceType() {
    return await this.UART.eval(`proccess.env.BOARD`, function (t: any) {
      // find a way to pass this data back.
      console.log(t);
    });
  }
  async getBattery() {
    return await this.UART.eval(`E.getBattery()`, function (t: any) {
      // find a way to pass this data back.
      console.log(t);
    });
  }
  async getTemperature() {
    return await this.UART.eval(`E.getTemperature()`, function (t: any) {
      // find a way to pass this data back.
      console.log(t);
    });
  }

  connect(): void {
    this.UART?.write('\x03', () => (this.connected = true));
  }
  disconnect() {
    this.UART?.close();
    this.connected = false;
  }
  reset() {
    this.UART.reset();
  }
  write(code: string) {
    this.UART.write(code);
  }
}
