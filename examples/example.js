const { default: AHT20 } = require('../AHT20.js');

AHT20.open().then(async (sensor) => {
    try {
        const temp = await sensor.temperature();
        const hum = await sensor.humidity();
        console.log(temp, hum);
    }
    catch(err) {
        console.log("Failed to get temperature or humidity data.");
    }
}).catch((err) => {
    console.error("Failed to open bus.");
});