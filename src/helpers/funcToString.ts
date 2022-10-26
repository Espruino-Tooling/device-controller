enum LEDEnum {
  red = 1,
  green = 2,
  blue = 3,
}

let modelObj: any = {
  PuckLEDon(color: string): string {
    return `LED${LEDEnum[color as any]}.set();`;
  },
  PuckLEDoff(color: string): string {
    return `LED${LEDEnum[color as any]}.reset();`;
  },
  PuckLEDtoggle(color: string): string {
    return `LED${LEDEnum[color as any]}.toggle();`;
  },
  PuckLEDflash(color: string, ms: number): string {
    return `digitalPulse(LED${LEDEnum[color as any]},1,${ms});`;
  },
  PuckLEDval(color: string): string {
    return `digitalRead(LED${color}) == 1;`;
  },
  PuckNFCsetUrl(url: string): string {
    return `NRF.nfcURL(${url});`;
  },
  PuckNFCreset(): string {
    return `NRF.nfcURL();`;
  },
  PuckIRtransmit(data: number[]): string {
    return `Puck.IR([${data.join(',')}]);`;
  },
  PuckMagenableMag(): string {
    return `Puck.magOn();`;
  },
  PuckMagenableField(): string {
    return `require("puckjsv2-mag-level").on();`;
  },
  PuckMagdisableMag(): string {
    return `Puck.magOff();`;
  },
  PuckMagdisableField(): string {
    return `require("puckjsv2-mag-level").off();`;
  },
  PuckgetLightVal(): string {
    return `Puck.light();`;
  },
  PuckaccelenableAccelMovement(): string {
    return `require("puckjsv2-accel-movement").on();`;
  },
  PuckaccelenableAccelBigMovement(): string {
    return `require("puckjsv2-accel-bigmovement").on();`;
  },
  PuckaccelenableAccelTilt(): string {
    return `require("puckjsv2-accel-tilt").on();`;
  },
  PuckacceldisableAccelMovement(): string {
    return `require("puckjsv2-accel-movement").off();`;
  },
  PuckacceldisableAccelBigMovement(): string {
    return `require("puckjsv2-accel-bigmovement").off();`;
  },
  PuckacceldisableAccelTilt(): string {
    return `require("puckjsv2-accel-tilt").off();`;
  },
  Puckaccelval(): string {
    return `Puck.accel();`;
  },
  PuckgetTemperature(): string {
    return `E.getTemperature();`;
  },
  Puckdump(): string {
    return `E.dumpStr();`;
  },
  Pixldump(): string {
    return `E.dumpStr();`;
  },
  Bangledump(): string {
    return `E.dumpStr();`;
  },
  DeviceControllerdump(): string {
    return `E.dumpStr();`;
  },
  PuckgetDeviceType(): string {
    return `process.env.BOARD`;
  },
  PixlgetDeviceType(): string {
    return `process.env.BOARD`;
  },
  BanglegetDeviceType(): string {
    return `process.env.BOARD`;
  },
  DeviceControllergetDeviceType(): string {
    return `process.env.BOARD`;
  },
};

function replaceCode(str: string) {
  let convertedObjName = str.split('(')[0].replace(/\./g, '');
  let params = str.split('(')[1].replace(')', '').replace(/\'/g, '').split(',');

  console.log(modelObj[convertedObjName](...params));
  return '';
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
