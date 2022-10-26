enum LEDEnum {
  red = 1,
  green = 2,
  blue = 3,
}

let modelObj: any = {
  LEDon(color: string): string {
    return `LED${LEDEnum[color as any]}.set();`;
  },
  LEDoff(color: string): string {
    return `LED${LEDEnum[color as any]}.reset();`;
  },
  LEDtoggle(color: string): string {
    return `LED${LEDEnum[color as any]}.toggle();`;
  },
  LEDflash(color: string, ms: number): string {
    return `digitalPulse(LED${LEDEnum[color as any]},1,${ms});`;
  },
  LEDval(color: string): string {
    return `digitalRead(LED${color}) == 1;`;
  },
  NFCsetUrl(url: string): string {
    return `NRF.nfcURL(${url});`;
  },
  NFCreset(): string {
    return `NRF.nfcURL();`;
  },
  IRtransmit(data: number[]): string {
    return `Puck.IR([${data.join(',')}]);`;
  },
  MagenableMag(): string {
    return `Puck.magOn();`;
  },
  MagenableField(): string {
    return `require("puckjsv2-mag-level").on();`;
  },
  MagdisableMag(): string {
    return `Puck.magOff();`;
  },
  MagdisableField(): string {
    return `require("puckjsv2-mag-level").off();`;
  },
  getLightVal(): string {
    return `Puck.light();`;
  },
  accelenableAccelMovement(): string {
    return `require("puckjsv2-accel-movement").on();`;
  },
  accelenableAccelBigMovement(): string {
    return `require("puckjsv2-accel-bigmovement").on();`;
  },
  accelenableAccelTilt(): string {
    return `require("puckjsv2-accel-tilt").on();`;
  },
  acceldisableAccelMovement(): string {
    return `require("puckjsv2-accel-movement").off();`;
  },
  acceldisableAccelBigMovement(): string {
    return `require("puckjsv2-accel-bigmovement").off();`;
  },
  acceldisableAccelTilt(): string {
    return `require("puckjsv2-accel-tilt").off();`;
  },
  accelval(): string {
    return `Puck.accel();`;
  },
  getTemperature(): string {
    return `E.getTemperature();`;
  },
  dump(): string {
    return `E.dumpStr();`;
  },
  getDeviceType(): string {
    return `process.env.BOARD`;
  },
};

function replaceCode(str: string) {
  let convertedObjName = str
    .split('(')[0]
    .split('.')
    .slice(1, -1)
    .join('.')
    .replace(/\./g, '');
  let params = str.split('(')[1].replace(')', '').replace(/\'/g, '').split(',');
  return modelObj[convertedObjName](...params);
}

export function miniEspParser(func: Function): string {
  let stringified_func = func.toString().split('\n').slice(1, -1).join('\n');

  // This will grab any method call from the code for use in replace
  let deviceObjMethodRegex =
    /(Puck|Pixl|Bangle|DeviceControl{2}er)+.+[a-zA-Z]+.+[a-zA-Z]+[\((+([a-zA-Z\d.!?\\\"\'-\\\(\s\)]+\)|\)];/g;

  return stringified_func.replace(deviceObjMethodRegex, (e: string) =>
    replaceCode(e),
  );
}

declare const Puck: any;

let code = function () {
  Puck.LED.on('green');
};
