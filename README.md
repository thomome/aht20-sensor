# aht20-sensor

A Node.js I2C module for the Adafruit AHT20 Humidity/Temperature Sensor.

## Installation
```
npm install aht20-sensor
```

## Example
```js
const { default: AHT20 } = require('../AHT20.js');

AHT20.open().then(async (sensor) => {
    const temp = await sensor.temperature();
    const hum = await sensor.humidity();
    console.log(temp, hum);
});
```

## Wiring
Wiring can be found here: https://cdn-learn.adafruit.com/downloads/pdf/adafruit-aht20.pdf