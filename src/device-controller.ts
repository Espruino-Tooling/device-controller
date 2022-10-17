import { uart } from '@espruino-tools/uart';
import { fetchToText } from './helpers/fetchHelper';
import { IDeviceController } from './types/device-controller-types';

type UART = typeof uart;

export class DeviceController implements IDeviceController {
  connected: boolean = false;
  UART: UART = uart;
  deviceType: string | undefined = undefined;
  Call: any = {};
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
    const p = new Promise<void>((resolve) => {
      let callback = () => {
        resolve();
      };
      this.UART.write(code, callback);
    }).catch((err) => {
      throw new Error(err);
    });
    return p;
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
    if (!this.connected) {
      await this.write('\x03;\n').then(() => {
        this.connected = true;
        this.UART.write('digitalPulse(LED2,1,100);\n');
        this.getDeviceType().then((type: string) => {
          this.deviceType = type;
          this.getDeviceFunctions();
          callback();
        });
      });
    }
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

  #mapStringFunctionToCall(funcArr: { name: string; parameters: string[] }[]) {
    funcArr.map((func) => {
      this.Call = {
        [func.name]: (...args: any) => {
          args.length == 0;
          this.UART.write(`${func.name}(${JSON.stringify(args.join(','))});\n`);
        },
        ...this.Call,
      };
    });
  }

  async getDeviceFunctions(): Promise<void> {
    this.Call = {};
    await this.dump().then((dumpedStr: any) => {
      this.#mapStringFunctionToCall(
        this.#getFunctionNamesFromString(dumpedStr),
      );
    });
  }

  #getFunctionNamesFromString(str: string) {
    let str_arr = str.split('\n');

    let new_arr = str_arr.map((x) => {
      if (x.startsWith('function')) {
        return x.split('{')[0].replace('function', '').split(' ').join('');
      } else if (x.startsWith('let') || x.startsWith('const')) {
        if (x.includes('function(') || x.includes('=>')) {
          if (x.includes('=>')) {
            return x
              .split('=>')[0]
              .replace('let', '')
              .replace('const', '')
              .replace('=', '')
              .split(' ')
              .join('');
          } else {
            return x
              .split('{')[0]
              .replace('let', '')
              .replace('const', '')
              .replace('=', '')
              .replace('function', '')
              .split(' ')
              .join('');
          }
        }
      }
    });

    let filtered_arr = new_arr.filter(Boolean);

    return filtered_arr.map((func) => {
      return {
        name: (func as string).split('(')[0],
        parameters:
          (func as string).split('(')[1].replace(')', '').split(',')[0] !== ''
            ? (func as string).split('(')[1].replace(')', '').split(',')
            : [],
      };
    });
  }
}
