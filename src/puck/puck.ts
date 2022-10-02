import { EspruinoTool } from '../espruino-tool';
import { stringifyFunction } from './helpers/funcToString';
import { IPuck } from './types/puck-types';

export class Puck extends EspruinoTool implements IPuck {
  onPress(func: Function) {
    this.UART.write(`
    reset();
    setWatch(function(){
      ${stringifyFunction(func)};
    }, BTN,{edge:"rising", repeat:true, debounce:50})
  `);
  }
}
