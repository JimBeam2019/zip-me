const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify');
const parse = require('csv-parse/lib/sync');

const logger = require('../config/logger');
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
      const dirPath = path.join(process.cwd(), '/file');

      const fileContent = await fs.readFileSync(`${dirPath}/${filename}`);

      const records = parse(fileContent, { columns: true, trim: true });

      logger.info('CSV', { records });
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
