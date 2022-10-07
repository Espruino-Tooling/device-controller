import { DeviceController } from './device-controller';
import { stringifyFunction } from './helpers/funcToString';
import { IPuck, LED, LEDColours, LEDColoursType } from './types/puck-types';

export class Puck extends DeviceController implements IPuck {
  LED: LED = {
    /**
     *
     * @param color LED Colour to be turned on
     */
    on: (color: LEDColoursType | LEDColoursType[]): void => {
      Array.isArray(color)
        ? this.UART.write(`digitalWrite(${color}, 1)`)
        : this.UART.write(`LED${LEDColours.indexOf(color) + 1}.set();\n`);
    },

    /**
     *
     * @param color LED Colour to be turned off
     */
    off: (color: LEDColoursType | LEDColoursType[]): void => {
      Array.isArray(color)
        ? this.UART.write(`digitalWrite(${color}, 0)`)
        : this.UART.write(`LED${LEDColours.indexOf(color) + 1}.reset();\n`);
    },

    /**
     *
     * @param color LED Colour to be toggled on/off
     */
    toggle: (color: LEDColoursType): void => {
      this.LED.val(color).then((res) => {
        res == 'true'
          ? this.UART.write(`LED${LEDColours.indexOf(color) + 1}.reset();\n`)
          : this.UART.write(`LED${LEDColours.indexOf(color) + 1}.set();\n`);
      });
    },

    /**
     *
     * @param color LED Colour to be flashed
     * @param ms time for LED to be flashed
     */
    flash: (color: LEDColoursType, ms: number): void => {
      this.UART.write(
        `digitalPulse(LED${LEDColours.indexOf(color) + 1},1,${ms});\n`,
      );
    },

    /**
     *
     * @param color LED colour to grab info from
     * @returns a boolean regarding if the LED is on or off
     */
    val: (color: LEDColoursType): Promise<string> => {
      return this.eval(`digitalRead(LED${LEDColours.indexOf(color) + 1}) == 1`);
    },
  };

  /**
   *
   * @returns temperature from device
   */
  async getTemperature(): Promise<number> {
    return await this.eval<number>(`E.getTemperature()`);
  }

  /**
   *
   * @param func A function to be run of press of pucks button
   */
  onPress(func: Function) {
    this.UART.write(`
    setWatch(function(){
      ${stringifyFunction(func)};
    }, BTN,{edge:"rising", repeat:true, debounce:50})
  `);
  }
}
