export interface IDeviceController {
  connected: boolean;
  UART: any;
  deviceType: string | undefined;
  connect(callback: Function): void;
  disconnect(callback: Function): void;
  reset(): void;
  dump(): Promise<string>;
  getDeviceType(): Promise<string>;
  getBattery(): Promise<number>;
  eval<T>(code: string): Promise<T>;
  upload(url: string, flash: boolean): void;
}
