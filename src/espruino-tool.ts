import uart from 'espruino-ble-uart';
import { IEspruinoTool } from './types/espruino-tool-types';

export class EspruinoTool implements IEspruinoTool {
  connected: boolean;
  UART: any;
  constructor() {
    this.connected = false;
    this.UART = uart;
  }

  connect(): void {
    this.UART?.write('\x03', () => (this.connected = true));
  }
  disconnect() {
    this.UART?.close();
    this.connected = false;
  }
}
