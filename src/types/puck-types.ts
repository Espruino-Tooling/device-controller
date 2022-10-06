export interface IPuck {
  onPress(func: Function): void;
}

export interface LED {
  set(): void;
  reset(): void;
}
