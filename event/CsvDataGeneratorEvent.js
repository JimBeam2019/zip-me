const EventEmitter = require('events');
const parse = require('csv-parse/lib/sync');

const logger = require('../config/logger');
const DataHelper = require('../helper/DataHelper');
const RandChar = require('../model/RandChar');

/**
 *
 *
 * @class CsvDataGeneratorEvent
 * @extends {EventEmitter}
 */
class CsvDataGeneratorEvent extends EventEmitter {
  /**
   * Creates an instance of CsvDataGeneratorEvent.
   * @memberof CsvDataGeneratorEvent
   */
  constructor() {
    super();

    this.MULTIPLE_CSV_DATA = 'multipleCsvData';
    this.ERROR = 'errorCsvData';

    this.multipleCsvDataEvent();
    this.errorEvent();
  }

  /**
   *
   *
   * @memberof CsvDataGeneratorEvent
   */
  multipleCsvDataEvent() {
    this.on(this.MULTIPLE_CSV_DATA, async (filename) => {
      const dataHelper = new DataHelper();
      const fileContent = await dataHelper.readFile(filename);

      const records = parse(fileContent, { columns: true, trim: true });
      const newRecords = [];

      for (let index = 0; index < 1000; index += 1) {
        const randIndex = RandChar.getRandomInt(records.length);
        const record = records[randIndex];

        newRecords.push(record);
      }

      await dataHelper.writeCsvFile(
        newRecords,
        'VictoriaD_BenPlanDeps_12082020_1000.csv'
      );
    });
  }

  /**
   *
   *
   * @return {string}
   * @memberof CsvDataGeneratorEvent
   */
  getMultipleCsvDataEventName() {
    return this.MULTIPLE_CSV_DATA;
  }

  /**
   *
   *
   * @memberof CsvDataGeneratorEvent
   */
  errorEvent() {
    this.on(this.ERROR, (error) => {
      logger.error(`Gracefully handling our error: ${error}`);
    });
  }

  /**
   *
   *
   * @return {string}
   * @memberof CsvDataGeneratorEvent
   */
  getErrorEventName() {
    return this.ERROR;
  }
}

module.exports = CsvDataGeneratorEvent;
