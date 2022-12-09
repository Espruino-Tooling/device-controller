import { PuckMock } from './assets/PuckMock';
import { UartMock } from './assets/UARTMock';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!doctype html><html><body></body></html>`);

global.document = dom.window.document;
global.window = dom.window as any;
global.navigator = global.window.navigator;

describe('get device type', () => {
  it('should return the type of device', () => {
    let device = PuckMock;

    device.getTemperature().then(() => {
      expect((device.UART as typeof UartMock).writtenData).toBe(
        'E.getTemperature();',
      );
    });
  });
});
