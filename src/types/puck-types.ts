export interface IPuck {
  onPress(func: Function): void;
  onTimedPress(long: Function, short: Function, ms: number): void;
  getTemperature(): Promise<number>;
  getLightVal(): Promise<number>;
  LED: LED;
  NFC: NFC;
  mag: Mag;
  accel: Accel;
  IR: IR;
  pin: Pin;
}

export interface Pin {
  val(): Promise<string>;
  onHigh(pin: string, func: Function): void;
}

export type LEDColoursType = 'red' | 'green' | 'blue';

export const LEDColours = ['red', 'green', 'blue'];

export interface IR {
  set(data: number[]): void;
  reset(): void;
}

export interface LED {
  on(color: LEDColoursType): void;
  off(color: LEDColoursType): void;
  toggle(color: LEDColoursType): void;
  flash(color: LEDColoursType, ms: number): void;
  val(color: LEDColoursType): Promise<string>;
}

export interface NFC {
  setUrl(url: string): void;
  reset(): void;
}

export interface Mag {
  enable(): void;
  disabled(): void;
  onMag(): void;
  onField(): void;
}

export interface Points3D {
  x: number;
  y: number;
  z: number;
}

export interface AccelDumpType {
  acc: Points3D;
  gyro: Points3D;
}

export interface Accel {
  enable(): void;
  disable(): void;
  val(): Promise<AccelDumpType>;
  onAccel(func: Function): void;
  onMove(func: Function): void;
  onSignificantMove(func: Function): void;
  stepCount: AccelStep;
}

export interface Tilt {
  enable(): void;
  disable(): void;
  onTilt(func: Function): void;
}

export interface AccelStep {
  enable(): void;
  disable(): void;
  get(): Promise<number>;
}
