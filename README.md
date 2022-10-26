![npm](https://img.shields.io/npm/v/@espruino-tools/device-controller)
![building](https://img.shields.io/azure-devops/build/espruino-tooling/092da48c-8411-42c2-8a97-8a94b5f45468/5)
![deploy](https://img.shields.io/azure-devops/build/espruino-tooling/092da48c-8411-42c2-8a97-8a94b5f45468/9?label=deployment)
# espruino-tools

An interactive Espruino package to simplify the code interaction between Espruino device and the javascript code. This package intends to simplift the implementation of the [uart.ts]("123") package by making it more suitable to building stand alone web applications which incorporate web bluetooth espruino devices.

This tool requires web bluetooth to work so only works on chromium based web browsers of chrome version 56+.

Documentation for this package can be found [here]("insertdocumentationhere")

## Installation

### npm

run `npm i @espruino-tools/device-controller` in the root of your node project.

from here you can use the package and example of the use is below

### HTML script

_this is currently not implemented_

## Usage

### Connecting to Device

To connect to a device just import the chosen device, in this case the puck, and run the following commands;

```javascript
import { Puck } from '@espruino-tools/device-controller';

const puck = new Puck()

puck.connect();
```

### Disconnecting from a Device

```javascript
puck.disconnect();
```

### Resetting a Device

```javascript
puck.reset();
```

### Puck Specific

#### LED

turn on an LED

```javascript
puck.LED.on('red');
```

turn off an LED

```javascript
puck.LED.off('red');
```

flash an LED

```javascript
puck.LED.flash('red');
```

get the current value of an LED (_This currently turns off the LED on use_)

```javascript
puck.LED.val('red');
```

#### Temperature

```javascript
puck.getTemperature().then((temp) => console.log(temp));
```

#### onEvent

##### onPress

```javascript
puck.onPress(() => {
  puck.LED.flash('red');
});
```
