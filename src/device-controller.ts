import { uart } from '@espruino-tools/uart';
import { fetchToText } from './helpers/fetchHelper';
import { IDeviceController } from './types/espruino-tool-types';

export class DeviceController implements IDeviceController {
  connected: boolean;
  UART: any;
  deviceType: string | undefined;

  constructor() {
    this.connected = false;
    this.UART = uart;
    this.deviceType = undefined;
  }
  async dump(): Promise<string> {
    return this.eval('E.dumpStr();\n');
  }
  async getDeviceType(): Promise<string> {
    return this.eval<string>(`process.env.BOARD;\n`);
  }
  async getBattery(): Promise<number> {
    return this.eval<number>(`E.getBattery();\n`);
  }
  async getTemperature(): Promise<number> {
    return this.eval<number>(`E.getTemperature();\n`);
  }
  async eval<T>(code: string): Promise<T> {
    return new Promise<T>((resolve) => {
      this.UART.eval(code, function (t: T) {
        resolve(t);
      });
    });
  }

  async write(code: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.UART.write(code, function () {
        resolve();
      });
    });
  }

  async connect(callback: Function) {
    await this.write('\x03;\n').then(() => {
      this.connected = true;
      this.UART.write('digitalPulse(LED2,1,100);\n');
      this.getDeviceType().then((type: string) => {
        this.deviceType = type;
        callback();
      });
    });
  }
  async disconnect(callback: Function) {
    await this.write('digitalPulse(LED1,1,100);\n').then(() => {
      this.UART?.close();
      this.connected = false;
      this.deviceType = undefined;
      callback();
    });
  }

  reset(): void {
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
        // if its already there set success to false,
        //
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
