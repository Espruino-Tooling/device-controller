import { UartMock } from './assets/UARTMock';
import { DeviceControllerMock } from './assets/DeviceControllerMock';
import { JSDOM } from 'jsdom';
import { PuckMock } from './assets/PuckMock';

const dom = new JSDOM(`<!doctype html><html><body></body></html>`);

global.document = dom.window.document;
global.window = dom.window as any;
global.navigator = global.window.navigator;

describe('eval', () => {
  let device = DeviceControllerMock;

  device.eval('{}').then(() => {
    expect((device.UART as any).writtenData).toBe('{}');
  });
});

describe('pin', () => {
  it('val', () => {
    let device = DeviceControllerMock;

    device.Pin.val('D1').then(() => {
      expect((device.UART as any).writtenData).toBe('D1.read()');
    });
  });
  it('analogOn', () => {
    let device = DeviceControllerMock;

    const p = new Promise((resolve) => {
      device.Pin.analogOn('D1', 1);

      resolve('');
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe('analogWrite(D1,1);\n');
    });
  });
  it('digitalOn', () => {
    let device = DeviceControllerMock;

    const p = new Promise((resolve) => {
      device.Pin.digitalOn('D1', 1);

      resolve('');
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe('digitalWrite(D1,1);\n');
    });
  });
  it('digitalToggle', () => {
    let device = DeviceControllerMock;

    const p = new Promise((resolve) => {
      device.Pin.digitalToggle('D1');

      resolve('');
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe('D1.toggle();\n');
    });
  });
  it('reset', () => {
    let device = DeviceControllerMock;

    const p = new Promise((resolve) => {
      device.Pin.reset('D1');

      resolve('');
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe('D1.reset();\n');
    });
  });
  it('getInfo', () => {
    let device = DeviceControllerMock;

    device.Pin.getInfo('D1').then(() => {
      expect((device.UART as any).writtenData).toBe('D1.getInfo()');
    });
  });
});

describe('connection', () => {
  it('should connect to device', () => {
    let device = DeviceControllerMock;

    device.connect().then(() => {
      expect((device.UART as any).writtenData).toBe('{}');
    });
  });

  it('should disconnect from device', () => {
    let device = DeviceControllerMock;

    device.disconnect().then(() => {
      expect((device.UART as any).writtenData).toBe(
        'digitalPulse(LED1,1,100);\n',
      );
    });
  });
});

describe('get device type', () => {
  it('should return the type of device', () => {
    let device = DeviceControllerMock;

    device.getDeviceType().then(() => {
      expect((device.UART as any).writtenData).toBe('process.env.BOARD');
    });
  });
});

describe('get device dump', () => {
  it('should return the dump from device', () => {
    let device = DeviceControllerMock;

    device.dump().then(() => {
      expect((device.UART as any).writtenData).toBe('E.dumpStr()');
    });
  });
});

describe('get device battery', () => {
  it('should return the battery from device', () => {
    let device = DeviceControllerMock;

    device.getBattery().then(() => {
      expect((device.UART as any).writtenData).toBe('E.getBattery()');
    });
  });
});

describe('reset device', () => {
  it('should reset device', () => {
    let device = DeviceControllerMock;
    const p = new Promise((resolve) => {
      device.reset();
      resolve('');
    }).catch((err) => {
      console.log((device.UART as any).writtenData);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe('reset(true);\n');
    });
  });
});

describe('upload code', () => {
  it('should show code from pastebin page', async () => {
    let device = DeviceControllerMock;

    // fetch ommitted due as there is no need to test an
    // inbuild feature.

    const p = new Promise((resolve) => {
      device.loadCode("console.log('hello'").then(() => {
        resolve('');
      });
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect((device.UART as any).writtenData).toBe("console.log('hello')");
    });
  });
});

describe('call', () => {
  it('should convert string code to an object', () => {
    let device = DeviceControllerMock;

    Reflect.defineProperty(PuckMock, 'dump', {
      value: function () {
        return new Promise<string>((resolve) =>
          resolve(`function func1(arg1){
          // do something
        }
        const func2 = () => {
          // do something
        }
        let func3 = function(arg2){
          // do something
        }`),
        );
      },
    });

    const p = new Promise((resolve) => {
      device.getDeviceFunctions().then(() => {
        resolve('');
      });
    }).catch((err) => {
      throw new Error(err);
    });

    p.then(() => {
      expect(device.Call).toBe([
        {
          name: 'func1',
          args: ['arg1'],
        },
        { name: 'func2', args: [] },
        { name: 'func3', args: ['arg2'] },
      ]);
    });
  });
});
