export interface IEspruinoTool {
  connected: boolean;
  UART: any;
  connect(): void;
  disconnect(): void;
  reset(): void;
  write(code: string): void;
  upload(url: string): void;
  eval(func: Function): any;
  dump(): void;
  getDeviceType(): any;
  getBattery(): any;
  getTemperature(): any;
}
