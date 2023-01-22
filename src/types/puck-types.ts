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
}

export type LEDColoursType = 'red' | 'green' | 'blue';

export const LEDColours = ['red', 'green', 'blue'];

export interface IR {
  transmit(data: number[]): void;
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
  enableMag(): void;
  enableField(): void;
  disableMag(): void;
  disableField(): void;
  onMag(func: Function): void;
  onField(func: Function): void;
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
  enableAccelMovement(): void;
  enableAccelBigMovement(): void;
  enableAccelTilt(): void;
  disableAccelMovement(): void;
  disableAccelBigMovement(): void;
  disableAccelTilt(): void;
  val(): Promise<AccelDumpType>;
  onMove(func: Function): void;
  onTilt(func: Function): void;
}

export interface Tilt {
  enable(): void;
  disable(): void;
  onTilt(func: Function): void;
}
