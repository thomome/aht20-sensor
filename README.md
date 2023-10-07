# aht20-sensor

A Node.js I2C module for the Adafruit AHT20 Humidity/Temperature Sensor.

## Installation
```
npm install aht20-sensor
```

## Example
```js
const aht20 = require('aht20-sensor');

aht20.open().then(async (sensor) => {
    const temp = await sensor.temperature();
    const hum = await sensor.humidity();
    console.log(temp, hum);
});
```

```ts
import aht20 from 'aht20-sensor';

aht20.open().then(async (sensor) => {
    const temp = await sensor.temperature();
    const hum = await sensor.humidity();
    console.log(temp, hum);
});
```

## Wiring

Wiring can be found here: https://cdn-learn.adafruit.com/downloads/pdf/adafruit-aht20.pdf