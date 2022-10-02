export interface IEspruinoTool {
  connected: boolean;
  UART: any;
  connect(): void;
  disconnect(): void;
  reset(): void;
  dump(): void;
  getDeviceType(): any;
  getBattery(): any;
  getTemperature(): any;
  eval<T>(code: string): Promise<T>;
}
