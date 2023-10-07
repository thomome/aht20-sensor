const { default: aht20 } = require('../AHT20.js');

aht20.open().then(async (sensor) => {
    const temp = await sensor.temperature();
    const hum = await sensor.humidity();
    console.log(temp, hum);
});