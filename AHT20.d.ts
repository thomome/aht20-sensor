import i2c from 'i2c-bus';
export default class AHT20 {
    private readonly bus;
    constructor(bus: i2c.PromisifiedBus);
    static open(busNumber?: number): Promise<AHT20>;
    init(): Promise<boolean>;
    getStatus(): Promise<number>;
    reset(): Promise<boolean>;
    calibrate(): Promise<boolean>;
    readData(): Promise<{
        [key: string]: number;
    }>;
    temperature(): Promise<number>;
    humidity(): Promise<number>;
}
