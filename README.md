![npm][npm version badge]
![building][package building state]
![deploy][package deployment state]

# @espruino-tools/core

An interactive Espruino package to simplify the code interaction between Espruino device and the javascript code. This package intends to simplift the implementation of the [uart.ts]("123") package by making it more suitable to building stand alone web applications which incorporate web bluetooth espruino devices.

This tool requires web bluetooth to work so only works on chromium based web browsers of chrome version 56+.

Documentation for this package can be found [here]("https://documentation-espruino-tools.vercel.app/")

## Installation

### CDN

We use unpkg to allow for CDN usage within the script tags it can be accessed like so.

```html
<script src="https://unpkg.com/@espruino-tools/core@latest/min/main.min.js"></script>
```

### NPM

run `npm i @espruino-tools/core` in the root of your node project.

from here you can use the package and example of the use is below

```javascript
import { Puck } from '@espruino-tools/core';

const puck = new Puck();

puck.connect();
```

Further information on package functionality can be found on the documentation [here]("https://documentation-espruino-tools.vercel.app/")

[npm version badge]: https://img.shields.io/npm/v/@espruino-tools/core
[package building state]: https://img.shields.io/azure-devops/build/espruino-tooling/Espruino%2520tools/14
[package deployment state]: https://img.shields.io/azure-devops/build/espruino-tooling/Espruino%2520tools/14?color=blue&label=deployment
