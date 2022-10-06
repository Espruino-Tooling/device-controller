export interface IPuck {
  onPress(func: Function): void;
  onWebPress(obj: HTMLElement, code: string): void;
}

export interface LED {
  set(): void;
  reset(): void;
}
