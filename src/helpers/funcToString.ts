let modelObj: any = {
  'Puck.LED.on("red")': 'LED.set();',
  'Puck.LED.on("green")': 'LED2.set();',
  'Puck.LED.on("blue")': 'LED3.set();',
  'Puck.LED.off("red")': 'LED.reset();',
  'Puck.LED.off("green")': 'LED2.reset();',
  'Puck.LED.off("blue")': 'LED3.reset();',
  'Puck.LED.toggle("red")': 'LED.toggle();',
  'Puck.LED.toggle("green")': 'LED2.toggle();',
  'Puck.LED.toggle("blue")': 'LED3.toggle();',
};

function replaceCode(str: string) {
  return modelObj[str];
}

export function miniEspParser(func: Function): string {
  let stringified_func = func.toString().split('\n').slice(1, -1).join('\n');

  // This will grab any method call from the code for use in replace
  let deviceObjMethodRegex =
    /(Puck|Pixl|Bangle|DeviceControl{2}er)+.+[a-zA-Z]+.+[a-zA-Z]+[\((+([a-zA-Z\d.!?\\\"\'-\\\(\s\)]+\)|\)];/g;

  return stringified_func.replace(deviceObjMethodRegex, (e) => replaceCode(e));
}
