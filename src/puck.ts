import { DeviceController } from './device-controller';
import { stringifyFunction } from './helpers/funcToString';
import { IPuck } from './types/puck-types';

export class Puck extends DeviceController implements IPuck {
  onWebPress(obj: HTMLElement, code: string): void {
    obj.addEventListener('click', () => {
      this.UART.write(code);
    });
  }
  onPress(func: Function) {
    this.UART.write(`
    setWatch(function(){
      ${stringifyFunction(func)};
    }, BTN,{edge:"rising", repeat:true, debounce:50})
  `);
  }
}
