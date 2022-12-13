import { miniEspParser } from '../helpers/funcToString';
import { Puck } from '../puck';

describe('convert code', () => {
  it('should convert code from espruino-tools to native espruino', () => {
    let puck = new Puck();
    let code = () => {
      puck.LED.on('red');
    };
    expect(miniEspParser(code).trimStart()).toBe('LED1.set();');
  });
});
