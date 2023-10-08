import i2c from 'i2c-bus';
/**
 * AHT20 sensor class with data read functions.
 */
export default class AHT20 {
    /**
     * Bus instance.
     */
    private readonly bus;
    /**
     * Constructor
     * @param bus bus instance
     */
    constructor(bus: i2c.PromisifiedBus);
    /**
     * Opens i2c bus and connect to the AHT20 sensor.
     * @param busNumber Target bus number to open. Default is 1.
     * @returns AHT20 instance with opened bus instance. You can read information with this instance.
     * @throws An error that occurred while opening i2c bus.
     */
    static open(busNumber?: number): Promise<AHT20>;
    /**
     * Initializes AHT20 sensor.
     * @returns `true` if successfully initialized the sensor.
     * @throws An error that occurred while initializing the sensor.
     */
    init(): Promise<boolean>;
    /**
     * Gets AHT20 sensor status.
     * @returns Sensor status
     * @throws An error that occurred while getting sensor status.
     */
    getStatus(): Promise<number>;
    /**
     * Resets AHT20 sensor.
     * @returns `true` if successfully reset the sensor.
     * @throws An error that occurred while resetting the sensor.
     */
    reset(): Promise<boolean>;
    /**
     * Calibrates AHT20 sensor.
     * @returns `true` if successfully calibrated the sensor.
     * @throws An error that occurred while calibrating the sensor.
     */
    calibrate(): Promise<boolean>;
    /**
     * Reads information from AHT20 sensor.
     * @returns Information dictionary with temperature and humidity data.
     * @throws An error that occurred while Reading the information.
     */
    readData(): Promise<{
        [key: string]: number;
    }>;
    /**
     * Gets temperature data from AHT20 sensor.
     * @returns Temperature gotten from the sensor in Celsius.
     * @throws An error that occurred while getting temperature data.
     */
    temperature(): Promise<number>;
    /**
     * Gets humidity data from AHT20 sensor.
     * @returns Humidity gotten from the sensor in RH%.
     * @throws An error that occurred while getting humidity data.
     */
    humidity(): Promise<number>;
}
