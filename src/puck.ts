import { DeviceController } from './device-controller';
import { stringifyFunction } from './helpers/funcToString';
import { IPuck, LED, LEDColours, LEDColoursType } from './types/puck-types';

export class Puck extends DeviceController implements IPuck {
  LED: LED = {
    on: (color: LEDColoursType | LEDColoursType[]): void => {
      Array.isArray(color)
        ? this.UART.write(`digitalWrite(${color}, 1)`)
        : this.UART.write(`LED${LEDColours.indexOf(color) + 1}.set();\n`);
    },
    off: (color: LEDColoursType | LEDColoursType[]): void => {
      Array.isArray(color)
        ? this.UART.write(`digitalWrite(${color}, 0)`)
        : this.UART.write(`LED${LEDColours.indexOf(color) + 1}.reset();\n`);
    },
    toggle: (color: LEDColoursType): void => {
      this.write(
        `digitalRead(LED${
          LEDColours.indexOf(color) + 1
        }) == '0' && this.LED.on(color);\n`,
      );
    },
    flash: (color: LEDColoursType, ms: number): void => {
      this.UART.write(
        `digitalPulse(LED${LEDColours.indexOf(color) + 1},1,${ms});\n`,
      );
    },
    val: (color: LEDColoursType): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        this.UART.write(
          `digitalRead(LED${LEDColours.indexOf(color) + 1})`,
          function (val: string) {
            resolve(val == '1');
          },
        );
      });
    },
  };
  onPress(func: Function) {
    this.UART.write(`
    setWatch(function(){
      ${stringifyFunction(func)};
    }, BTN,{edge:"rising", repeat:true, debounce:50})
  `);
  }
}
