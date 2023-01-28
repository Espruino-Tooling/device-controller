import { transpile } from '@espruino-tools/transpiler';
import { uart } from '@espruino-tools/uart';
import { fetchToText } from './helpers/fetchHelper';
import {
  digitalVals,
  IDeviceController,
  Pin,
  PinInfo,
} from './types/device-controller-types';

type UART = typeof uart;

export class DeviceController implements IDeviceController {
  connected: boolean = false;
  UART: UART = uart;
  deviceType: string | undefined = undefined;

  /**
   * An object holding any functions on the device
   */
  Call: any = {};

  /**
   * An Object containing all pin methods
   */
  Pin: Pin = {
    /**
     *
     * @param pin the pin to have its value returned
     * @returns current value of chosen pin
     */
    val: (pin: string): Promise<string> => this.eval(pin + '.read()'),

    /**
     *
     * @param pin the pin to have its analog value changed
     * @param val should be between 0 and 1, e.g. 0.5
     */
    analogOn: (pin: string, val: number) =>
      this.UART.write('analogWrite(' + pin + ',' + val + ');\n'),

    /**
     *
     * @param pin the pin to have its digital value changed
     * @param val can be either 0 or 1 for off or on
     */
    digitalOn: (pin: string, val: digitalVals) =>
      this.UART.write('digitalWrite(' + pin + ',' + val + ');\n'),

    /**
     *
     * @param pin the pin to be toggled
     */
    digitalToggle: (pin: string) => this.UART.write(pin + '.toggle();\n'),

    /**
     *
     * @param pin the pin to be reset
     */
    reset: (pin: string) => this.UART.write(pin + '.reset();\n'),

    /**
     *
     * @param pin the pin to gather information from
     * @returns a promise containing pin info
     */
    getInfo: (pin: string): Promise<PinInfo> => this.eval(pin + '.getInfo()'),
  };

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

  /**
   *
   * @param code code to be evaluated
   * @returns the response from the device in a Promise
   */
  async eval<T>(code: string): Promise<T> {
    const p = new Promise<T>((resolve) => {
      let callback = (data: T, log?: string) => {
        if (!log) log = '';
        resolve({ data, log } as any);
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
  async connect(callback?: Function) {
    await this.eval<any>('{}').then(({ data, log }: any) => {
      if (log == 'success') {
        this.connected = true;
        this.UART.write('digitalPulse(LED2,1,100);\n');
        this.getDeviceFunctions().then(() => {
          callback?.();
        });
      }
    });
  }

  /**
   *
   * @param callback the function to be run after disconnect
   */
  async disconnect(callback?: Function) {
    await this.eval<void>('digitalPulse(LED1,1,100);\n').then(() => {
      this.UART?.close();
      this.connected = false;
      this.deviceType = undefined;
      callback?.();
    });
  }

  /**
   * Clears any saved data on device.
   */
  reset(): void {
    this.UART.write('reset(true);\n');
  }

  /**
   *
   * > **WARNING**  THIS CODE DOES NO CHECKS AND IS ONLY AVAILABLE FOR SPEED
   *                PURPOSES.
   *
   *                THIS SHOULD BE USED EXCLUSIVELY FOR WHEN CODE DOESNT NEED
   *                TO BE SAVED OR YOU ALREADY KNOW THE METHODS AVAILABLE
   *
   * @param data code written in espruino native code NOT IN THIS LIBRARIES CODE
   */
  quickWrite(data: string): void {
    this.UART.write(data);
  }

  /**
   *
   * @param code code written in espruino native code, NOT IN THIS LIBRARIES CODE
   * @param flash
   */
  async loadCode(code: string, flash: boolean = false) {
    let deviceType = await this.getDeviceType();

    if (deviceType === 'BANGLEJS') {
      flash = false;
    }
    let success = false;
    this.reset();
    if (!flash && !success) {
      this.UART.write(code);
    } else if (!success && deviceType !== 'PIXLJS') {
      this.UART.write(`E.setBootCode(\`${code}\`,true);\n`);
      this.UART.write('load();\n');
    } else if (!success) {
      this.UART.write(code);
      this.UART.write('save();\n');
      this.UART.write('load();\n');
    }
    this.getDeviceFunctions();
  }

  setInterval(func: Function, ms: number = 2000) {
    let transpiled_code = transpile(
      `DeviceController.setInterval(${func.toString()}, ${ms})`,
      {
        additional_callees: ['p'],
        parse_type: 'module',
      },
    );
    this.UART.write(transpiled_code);
  }

  /**
   *
   * @param url the url to grab data from
   * @param flash
   */
  async upload(url: string, flash: boolean = false) {
    await fetchToText(url).then(async (rawCode: string) => {
      this.loadCode(rawCode, flash);
    });
  }

  /**
   *
   * @param funcArr an array of function details type explained below
   */
  #mapStringFunctionToCall(funcArr: { name: string; parameters: string[] }[]) {
    funcArr.map((func) => {
      /* 
        This anonymous function converts the array of function data into a digestible callable javascript object
        in notation function_name : function(param1,...){}
        It then 
      */
      this.Call = {
        [func.name]: (...args: any) => {
          this.UART.write(`${func.name}(${JSON.stringify(args.join(','))});\n`);
        },
        ...this.Call,
      };
    });
  }

  /**
   * helper function to grab functions from device
   */
  async getDeviceFunctions(): Promise<void> {
    this.Call = await this.dump().then((dumpedStr: any) => {
      this.#mapStringFunctionToCall(
        this.#getFunctionNamesFromString(dumpedStr.data),
      );
    });
  }

  /**
   *
   * @param str a string of code to be coverted into functions.
   * @returns an object containing function names and parameters.
   */
  #getFunctionNamesFromString(
    str: string,
  ): { name: string; parameters: string[] }[] {
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
