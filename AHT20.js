/*
  AHT20.js
  A Node.js I2C module for the Adafruit AHT20 Humidity/Temperature Sensor.
*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2c_bus_1 = __importDefault(require("i2c-bus"));
const AHT20_I2CADDR = 0x38;
const AHT20_CMD_SOFTRESET = [0xBA];
const AHT20_CMD_CALIBRATE = [0xE1, 0x08, 0x00];
const AHT20_CMD_MEASURE = [0xAC, 0x33, 0x00];
const AHT20_STATUS_BUSY = 0x80;
const AHT20_STATUS_CALIBRATED = 0x08;
class AHT20 {
    constructor(bus) {
        this.bus = bus;
    }
    static open(busNumber = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bus = yield i2c_bus_1.default.openPromisified(busNumber);
                const sensor = new AHT20(bus);
                yield sensor.init();
                return sensor;
            }
            catch (err) {
                throw err;
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sleep(20);
                yield this.reset();
                if (!(yield this.calibrate())) {
                    throw ('Could not calibrate!');
                }
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = Buffer.alloc(1);
                yield this.bus.i2cRead(AHT20_I2CADDR, buf.length, buf);
                return buf.readInt8();
            }
            catch (err) {
                throw err;
            }
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = Buffer.from(AHT20_CMD_SOFTRESET);
                yield this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
                yield sleep(20);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    calibrate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = Buffer.from(AHT20_CMD_CALIBRATE);
                yield this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
                while ((yield this.getStatus()) & AHT20_STATUS_BUSY) {
                    yield sleep(10);
                }
                if ((yield this.getStatus()) & AHT20_STATUS_CALIBRATED) {
                    return true;
                }
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    readData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = Buffer.from(AHT20_CMD_MEASURE);
                yield this.bus.i2cWrite(AHT20_I2CADDR, buf.length, buf);
                while ((yield this.getStatus()) & AHT20_STATUS_BUSY) {
                    yield sleep(10);
                }
                const rbuf = Buffer.alloc(7);
                yield this.bus.i2cRead(AHT20_I2CADDR, rbuf.length, rbuf);
                const humidity = round(((rbuf[1] << 12) | (rbuf[2] << 4) | (rbuf[3] >> 4)) * 100 / 0x100000, 2);
                const temperature = round((((rbuf[3] & 0xF) << 16) | (rbuf[4] << 8) | rbuf[5]) * 200.0 / 0x100000 - 50, 2);
                return {
                    humidity,
                    temperature
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    temperature() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { temperature } = yield this.readData();
                return temperature;
            }
            catch (err) {
                throw err;
            }
        });
    }
    humidity() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { humidity } = yield this.readData();
                return humidity;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AHT20;
const round = (value, dmp) => {
    return Math.round(value / Math.pow(10, -dmp)) / Math.pow(10, dmp);
};
const sleep = (duration) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
};
