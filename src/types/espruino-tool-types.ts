export interface IEspruinoTool {
  connected: boolean;
  UART: any;
  connect(): void;
  disconnect(): void;
  reset(): void;
  dump(): Promise<string>;
  getDeviceType(): Promise<string>;
  getBattery(): Promise<number>;
  getTemperature(): Promise<number>;
  eval<T>(code: string): Promise<T>;
  upload(url: string, flash: boolean): void;
}
