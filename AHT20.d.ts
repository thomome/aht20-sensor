import i2c from 'i2c-bus';
export default class AHT20 {
    private readonly bus;
    constructor(bus: i2c.PromisifiedBus);
    static open(busNumber?: number): Promise<any>;
    init(): Promise<any>;
    getStatus(): Promise<any>;
    reset(): Promise<any>;
    calibrate(): Promise<any>;
    readData(): Promise<any>;
    temperature(): Promise<any>;
    humidity(): Promise<any>;
}
