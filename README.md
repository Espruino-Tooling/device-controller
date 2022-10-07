![npm](https://img.shields.io/npm/v/@espruino-tools/device-controller)

# espruino-tools

An interactive Espruino package to simplify the code interaction between Espruino device and the javascript code. This package intends to simplift the implementation of the [uart.ts]("123") package by making it more suitable to building stand alone web applications which incorporate web bluetooth espruino devices.

This tool requires web bluetooth to work so only works on chromium based web browsers of chrome version 56+.

Documentation for this package can be found [here]("insertdocumentationhere")

## Installation

### npm

run `npm i @espruino-tools/device-controller` in the root of your node project.

from here you can use the package and example of the use is below

## Usage

### Connecting to Device
To connect to a device just import the chosen device, in this case the puck, and run the following commands;
```javascript

import { Puck } from '@espruino-tools/device-controller';

const puck = new Puck();

puck.connect()
```

### Disconnecting from a Device
```javascript
puck.disconnect()
```

### Resetting a Device
```javascript
puck.reset()
```
