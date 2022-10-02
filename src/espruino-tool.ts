import uart from 'espruino-ble-uart';
import { fetchToText } from './helpers/fetchHelper';
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
    this.UART.write('reset(true);\n');
  }
  async upload(url: string, flash: boolean = false) {
    let deviceType = await this.getDeviceType();

    if (deviceType === 'BANGLEJS') {
      flash = false;
    }
    let success = false;
    await fetchToText(url).then(async (rawCode: string) => {
      this.dump().then(async (response: string) => {
        // check if code is already on the device.
      });
      this.reset();
      if (!flash && !success) {
        this.UART.write(rawCode);
      } else if (!success && deviceType !== 'PIXLJS') {
        this.UART.write(`E.setBootCode(\`${rawCode}\`,true);\n`);
        this.UART.write('load();\n');
      } else if (!success) {
        this.UART.write(rawCode);
        this.UART.write('save();\n');
        this.UART.write('load();\n');
      }
    });
  }
}
