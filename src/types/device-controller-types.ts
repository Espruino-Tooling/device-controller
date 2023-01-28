export interface IDeviceController {
  connected: boolean;
  UART: any;
  deviceType: string | undefined;
  Call: any;
  Pin: Pin;
  connect(callback: Function): void;
  disconnect(callback: Function): void;
  reset(): void;
  dump(): Promise<string>;
  getDeviceType(): Promise<string>;
  getBattery(): Promise<number>;
  eval<T>(code: string): Promise<T>;
  quickWrite(code: string): void;
  upload(url: string, flash: boolean): void;
  getDeviceFunctions(): Promise<void>;
}

export interface PinInfo {
  port: string; // the Pin's port on the chip
  num: number; // the Pin's number
  in_addr: number; // (if available) the address of the pin's input address in bit-banded memory (can be used with peek)
  out_addr: number; // (if available) the address of the pin's output address in bit-banded memory (can be used with poke)
  analog: { ADCs: number[]; channel: number }; // If analog input is available
  functions: {
    TIM1: { type: string; af: number };
    I2C3: { type: string; af: number };
  };
}

export interface Pin {
  val(pin: string): Promise<string>;
  analogOn(pin: string, val: number): void;
  digitalOn(pin: string, val: number): void;
  digitalToggle(pin: string): void;
  reset(pin: string): void;
  getInfo(pin: string): Promise<PinInfo>;
}

export type digitalVals = 0 | 1;
