import { uart } from '@espruino-tools/uart';
import { fetchToText } from './helpers/fetchHelper';
import { IDeviceController } from './types/device-controller-types';

type UART = typeof uart;

export class DeviceController implements IDeviceController {
  connected: boolean;
  UART: UART;
  deviceType: string | undefined;

  constructor() {
    this.connected = false;
    this.UART = uart;
    this.deviceType = undefined;
  }

  /**
   *
   * @returns  promise containing all code stored on device
   */
  async dump(): Promise<string> {
    return await this.eval('E.dumpStr()');
  }

  /**
   *
   * @returns device type of connected device
   */
  async getDeviceType(): Promise<string> {
    return await this.eval<string>(`process.env.BOARD`);
  }

  /**
   *
   * @returns battery percentage of the connected device
   */
  async getBattery(): Promise<number> {
    return await this.eval<number>(`E.getBattery()`);
  }

  async write(code: string): Promise<void> {
    return await this.eval<void>(code);
  }

  /**
   *
   * @param code code to be evaluated
   * @returns the response from the device in a Promise
   */
  async eval<T>(code: string): Promise<T> {
    const p = new Promise<T>((resolve) => {
      let callback = (data: T) => {
        resolve(data);
      };
      this.UART.eval(code, callback);
    }).catch((err) => {
      throw new Error(err);
    });
    return p;
  }

  /**
   *
   * @param callback the function to be run after connect
   */
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

  /**
   *
   * @param callback the function to be run after disconnect
   */
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
