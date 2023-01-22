import { transpile } from '@espruino-tools/transpiler';
import { DeviceController } from './device-controller';
import {
  Accel,
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
      let transpiled_code = transpile(`p.mag.onMag(${func.toString()})`, {
        additional_callees: ['p'],
        parse_type: 'module',
      });
      this.UART.write(transpiled_code);
    },
    onField: (func: Function): void => {
      let transpiled_code = transpile(`p.mag.onField(${func.toString()})`, {
        additional_callees: ['p'],
        parse_type: 'module',
      });
      this.UART.write(transpiled_code);
    },
  };

  accel: Accel = {
    enableAccelMovement: () => {
      this.UART.write('require("puckjsv2-accel-movement").on();\n');
    },
    enableAccelBigMovement: () => {
      this.UART.write('require("puckjsv2-accel-bigmovement").on();\n');
    },
    enableAccelTilt: () => {
      this.UART.write('require("puckjsv2-accel-tilt").on();\n');
    },
    disableAccelMovement: () => {
      this.UART.write('require("puckjsv2-accel-movement").off();\n');
    },
    disableAccelBigMovement: () => {
      this.UART.write('require("puckjsv2-accel-bigmovement").off();\n');
    },
    disableAccelTilt: () => {
      this.UART.write('require("puckjsv2-accel-tilt").off();\n');
    },
    val: (): Promise<AccelDumpType> => {
      return this.eval<AccelDumpType>('Puck.accel()');
    },

    onMove: (func: Function): void => {
      let transpiled_code = transpile(`p.accel.onMove(${func.toString()})`, {
        additional_callees: ['p'],
        parse_type: 'module',
      });
      this.UART.write(transpiled_code);
    },

    onTilt: (func: Function): void => {
      let transpiled_code = transpile(`p.accel.onTilt(${func.toString()})`, {
        additional_callees: ['p'],
        parse_type: 'module',
      });
      this.UART.write(transpiled_code);
    },
  };

  IR: IR = {
    transmit: (data: number[]): void => {
      this.UART.write('Puck.IR([' + data.join(',') + ']);\n');
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
    let transpiled_code = transpile(`p.onTimedPress(${func.toString()})`, {
      additional_callees: ['p'],
      parse_type: 'module',
    });
    this.UART.write(transpiled_code);
  }

  /**
   *
   * @param long The function to be called on a long press
   * @param short The function to be called on a short press
   * @param ms the time required to consider a press a long press
   */
  onTimedPress(long: Function, short: Function, ms: number = 0.3) {
    let transpiled_code = transpile(
      `p.onTimedPress(${long.toString()},${short.toString()},${ms})`,
      {
        additional_callees: ['p'],
        parse_type: 'module',
      },
    );
    this.UART.write(transpiled_code);
  }
}
