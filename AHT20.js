/*
  AHT20.js
  A Node.js I2C module for the Adafruit AHT20 Humidity/Temperature Sensor.
*/

'use strict';

const i2c = require('i2c-bus');

const AHT20_I2CADDR = 0x38
const AHT20_CMD_SOFTRESET = [0xBA]
const AHT20_CMD_CALIBRATE = [0xE1, 0x08, 0x00]
const AHT20_CMD_MEASURE = [0xAC, 0x33, 0x00]
const AHT20_STATUS_BUSY = 0x80;
const AHT20_STATUS_CALIBRATED = 0x08;

class AHT20 {
	constructor(bus) {
		this.bus = bus;
	}

	static async open(busNumber = 1) {
		try {
			const bus = await i2c.openPromisified(busNumber);
			const sensor = new AHT20(bus);
			await sensor.init();
			return sensor;
		} catch (err) {
			return err;
		}
	}

	async init() {
		try {
			await sleep(20);
			await this.reset();

			if (!await this.calibrate()) {
				throw('Could not calibrate!');
			}
			return true;
		} catch(err) {
			return err;
		}
	}

	async getStatus() {
		try {
			const buf = Buffer.alloc(1);
			await this.bus.i2cRead(AHT20_I2CADDR, buf.length, buf);
			return buf.readInt8();
		} catch (err) {
			return err;
		}
	}
	
	async reset() {
		try {
			const buf = Buffer.from(AHT20_CMD_SOFTRESET);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
			await sleep(20);
			return true;
		} catch (err) {
			return err;
		}
	}
	
	async calibrate() {
		try {
			const buf = Buffer.from(AHT20_CMD_CALIBRATE);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
			while (await this.getStatus() & AHT20_STATUS_BUSY) {
				await sleep(10);
			}
			
			if(await this.getStatus() & AHT20_STATUS_CALIBRATED) {
				return true;
			}
			return true;
		} catch (err) {
			return err;
		}
	}

	async readData() {
		try {
			const buf = Buffer.from(AHT20_CMD_MEASURE);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
			
			while (await this.getStatus() & AHT20_STATUS_BUSY) {
				await sleep(10);
			}

			const rbuf = Buffer.alloc(7);
			await this.bus.i2cRead(AHT20_I2CADDR, rbuf.length, rbuf);

			const humidity = round(((rbuf[1] << 12) | (rbuf[2] << 4) | (rbuf[3] >> 4)) * 100 / 0x100000, 2);
			const temperature = round((((rbuf[3] & 0xF) << 16) | (rbuf[4] << 8) | rbuf[5]) * 200.0 / 0x100000 - 50, 2);

			return {
				humidity,
				temperature
			};
		} catch (err) {
			return err;
		}
	}

	async temperature() {
		try {
			const { temperature } = await this.readData();
			return temperature;
		} catch (err) {
			return err;
		}
	}

	async humidity() {
		try {
			const { humidity } = await this.readData();
			return humidity;
		} catch (err) {
			return err;
		}
	}
}

const round = (value, dmp) => {
	return Math.round(value / Math.pow(10, -dmp)) / Math.pow(10, dmp);
}

const sleep = (duration) => {
	return new Promise((resolve) => {
		setTimeout(() => {
				resolve();
		}, duration)	
	})
}

module.exports = AHT20;
