export interface IPuck {
  onPress(func: Function): void;
  getTemperature(): Promise<number>;
  LED: LED;
  NFC: NFC;
}
export type LEDColoursType = 'red' | 'green' | 'blue';

export const LEDColours = ['red', 'green', 'blue'];

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
