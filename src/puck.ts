import { DeviceController } from './device-controller';
import { stringifyFunction } from './helpers/funcToString';
import {
  Accel,
  AccelStep,
  AccelDumpType,
  IPuck,
  IR,
  LED,
  LEDColours,
  LEDColoursType,
  Mag,
  NFC,
} from './types/puck-types';

export class Puck extends DeviceController implements IPuck {
  /**
   *
   * @returns a promise containing the light value detected by the puck device.
   */
  getLightVal(): Promise<number> {
    return this.eval<number>('Puck.light()');
  }

  mag: Mag = {
    enableMag: (): void => {
      this.UART.write('Puck.magOn();\n');
    },
    enableField: (): void => {
      this.UART.write('require("puckjsv2-mag-level").on();\n');
    },
    disableMag: (): void => {
      this.UART.write('Puck.magOff();\n');
    },
    disableField: (): void => {
      this.UART.write('require("puckjsv2-mag-level").off();\n');
    },
    onMag: (func: Function): void => {
      this.UART.write(`Puck.on('mag', function(){
        ${stringifyFunction(func)}  
      });\n`);
    },
    onField: (func: Function): void => {
      this.UART.write(`Puck.on('field', function(){
        ${stringifyFunction(func)}  
      });\n`);
    },
  };

  accel: Accel = {
    enable: function (): void {
      throw new Error('Function not implemented.');
    },
    disable: function (): void {
      throw new Error('Function not implemented.');
    },
    val: function (): Promise<AccelDumpType> {
      throw new Error('Function not implemented.');
    },
    onAccel: function (func: Function): void {
      throw new Error('Function not implemented.');
    },
    onMove: function (func: Function): void {
      throw new Error('Function not implemented.');
    },
    onSignificantMove: function (func: Function): void {
      throw new Error('Function not implemented.');
    },
    stepCount: {
      enable: function (): void {
        throw new Error('Function not implemented.');
      },
      disable: function (): void {
        throw new Error('Function not implemented.');
      },
      get: function (): Promise<number> {
        throw new Error('Function not implemented.');
      },
    } as AccelStep,
  };

  IR: IR = {
    transmit: (data: number[]): void => {
      this.UART.write('[' + data.join(',') + '];\n');
    },
  };

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
     * @param color LED Colour to be toggled
     */
    toggle: (color: LEDColoursType): void => {
      this.UART.write(`LED${LEDColours.indexOf(color) + 1}.toggle();\n`);
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

  NFC: NFC = {
    /**
     *
     * @param url the url to be used as the new NFC value
     */
    setUrl: (url: string) => this.UART.write('NRF.nfcURL("' + url + '");\n'),
    reset: () => this.UART.write('NRF.nfcURL();\n'),
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

  /**
   *
   * @param long The function to be called on a long press
   * @param short The function to be called on a short press
   * @param ms the time required to consider a press a long press
   */
  onTimedPress(long: Function, short: Function, ms: number = 0.3) {
    this.UART.write(`
      setWatch(function(){
        var ms = (e.time = e.lastTime);

        if(ms > ${ms}){
          ${stringifyFunction(long)};
        } else {
          ${stringifyFunction(short)};
        }
      }, BTN,{edge:"falling", repeat:true, debounce:50})
    `);
  }
}
