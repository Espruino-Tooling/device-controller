import { Puck } from '../../puck';
import { UartMock } from './UARTMock';

let PuckMock = new Puck();

Reflect.defineProperty(PuckMock, 'UART', {
  value: UartMock,
});

export { PuckMock };
