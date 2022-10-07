export interface IPuck {
  onPress(func: Function): void;
  LED: LED;
}
export type LEDColoursType = 'red' | 'green' | 'blue';

export const LEDColours = ['red', 'green', 'blue'];

export interface LED {
  on(color: LEDColoursType): void;
  off(color: LEDColoursType): void;
  toggle(color: LEDColoursType): void;
  flash(color: LEDColoursType, ms: number): void;
  val(color: LEDColoursType): Promise<boolean>;
}
