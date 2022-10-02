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
  async dump(): Promise<string> {
    return this.eval('E.dumpStr()');
  }
  async getDeviceType(): Promise<string> {
    return this.eval<string>(`process.env.BOARD`);
  }
  async getBattery(): Promise<number> {
    return this.eval<number>(`E.getBattery()`);
  }
  async getTemperature(): Promise<number> {
    return this.eval<number>(`E.getTemperature()`);
  }
  async eval<T>(code: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.UART.eval(code, function (t: T) {
        resolve(t);
      });
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
}
