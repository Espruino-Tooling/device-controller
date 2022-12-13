import { DeviceController } from '../../device-controller';
import { UartMock } from './UARTMock';

let DeviceControllerMock = new DeviceController();

Reflect.defineProperty(DeviceControllerMock, 'UART', {
  value: UartMock,
});

export { DeviceControllerMock };
