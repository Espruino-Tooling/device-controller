export interface IEspruinoTool {
  connected: boolean;
  UART: any;
  connect(): void;
  disconnect(): void;
}
