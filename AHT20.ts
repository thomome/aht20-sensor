/*
  AHT20.js
  A Node.js I2C module for the Adafruit AHT20 Humidity/Temperature Sensor.
*/

'use strict';

import i2c from 'i2c-bus';

const AHT20_I2CADDR: number = 0x38
const AHT20_CMD_SOFTRESET: number[] = [0xBA]
const AHT20_CMD_CALIBRATE: number[] = [0xE1, 0x08, 0x00]
const AHT20_CMD_MEASURE: number[] = [0xAC, 0x33, 0x00]
const AHT20_STATUS_BUSY: number = 0x80;
const AHT20_STATUS_CALIBRATED: number = 0x08;

/**
 * AHT20 sensor class with data read functions.
 */
export default class AHT20 {
    /**
     * Bus instance.
     */
    private readonly bus: i2c.PromisifiedBus;

    /**
     * Constructor
     * @param bus bus instance
     */
	constructor(bus: i2c.PromisifiedBus) {
		this.bus = bus;
	}

    /**
     * Opens i2c bus and connect to the AHT20 sensor.
     * @param busNumber Target bus number to open. Default is 1.
     * @returns AHT20 instance with opened bus instance. You can read information with this instance.
     * @throws An error that occurred while opening i2c bus.
     */
	static async open(busNumber: number = 1): Promise<AHT20> {
		try {
			const bus: i2c.PromisifiedBus = await i2c.openPromisified(busNumber);
			const sensor: AHT20 = new AHT20(bus);
			await sensor.init();
			return sensor;
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Initializes AHT20 sensor.
     * @returns `true` if successfully initialized the sensor.
     * @throws An error that occurred while initializing the sensor.
     */
	async init(): Promise<boolean> {
		try {
			await sleep(20);
			await this.reset();

			if (!await this.calibrate()) {
				throw('Could not calibrate!');
			}
			return true;
		} catch(err: any) {
			throw err;
		}
	}

    /**
     * Gets AHT20 sensor status.
     * @returns Sensor status
     * @throws An error that occurred while getting sensor status.
     */
	async getStatus(): Promise<number> {
		try {
			const buf: Buffer = Buffer.alloc(1);
			await this.bus.i2cRead(AHT20_I2CADDR, buf.length, buf);
			return buf.readInt8();
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Resets AHT20 sensor.
     * @returns `true` if successfully reset the sensor.
     * @throws An error that occurred while resetting the sensor.
     */
	async reset(): Promise<boolean> {
		try {
			const buf: Buffer = Buffer.from(AHT20_CMD_SOFTRESET);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
			await sleep(20);
			return true;
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Calibrates AHT20 sensor.
     * @returns `true` if successfully calibrated the sensor.
     * @throws An error that occurred while calibrating the sensor.
     */
	async calibrate(): Promise<boolean> {
		try {
			const buf: Buffer = Buffer.from(AHT20_CMD_CALIBRATE);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
			while (await this.getStatus() & AHT20_STATUS_BUSY) {
				await sleep(10);
			}

			if(await this.getStatus() & AHT20_STATUS_CALIBRATED) {
				return true;
			}
			return true;
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Reads information from AHT20 sensor.
     * @returns Information dictionary with temperature and humidity data.
     * @throws An error that occurred while Reading the information.
     */
	async readData(): Promise<{[key: string]: number}> {
		try {
			const buf: Buffer = Buffer.from(AHT20_CMD_MEASURE);
			await this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);

			while (await this.getStatus() & AHT20_STATUS_BUSY) {
				await sleep(10);
			}

			const rbuf: Buffer = Buffer.alloc(7);
			await this.bus.i2cRead(AHT20_I2CADDR, rbuf.length, rbuf);

			const humidity: number = round(((rbuf[1] << 12) | (rbuf[2] << 4) | (rbuf[3] >> 4)) * 100 / 0x100000, 2);
			const temperature: number = round((((rbuf[3] & 0xF) << 16) | (rbuf[4] << 8) | rbuf[5]) * 200.0 / 0x100000 - 50, 2);

			return {
				humidity,
				temperature
			};
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Gets temperature data from AHT20 sensor.
     * @returns Temperature gotten from the sensor in Celsius.
     * @throws An error that occurred while getting temperature data.
     */
	async temperature(): Promise<number> {
		try {
			const { temperature }: {[key: string]: number} = await this.readData();
			return temperature;
		} catch (err: any) {
			throw err;
		}
	}

    /**
     * Gets humidity data from AHT20 sensor.
     * @returns Humidity gotten from the sensor in RH%.
     * @throws An error that occurred while getting humidity data.
     */
	async humidity(): Promise<number> {
		try {
			const { humidity }: {[key: string]: number} = await this.readData();
			return humidity;
		} catch (err: any) {
			throw err;
		}
	}
}

const round = (value: number, dmp: number): number => {
	return Math.round(value / Math.pow(10, -dmp)) / Math.pow(10, dmp);
}

const sleep = (duration: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => {
				resolve();
		}, duration)
	})
}