const EventEmitter = require('events');
const parse = require('csv-parse/lib/sync');

const logger = require('../config/logger');
const RandChar = require('../model/RandChar');
const DataHelper = require('../helper/DataHelper');

/**
 *
 *
 * @class RandDataGeneratorEvent
 * @extends {EventEmitter}
 */
class RandDataGeneratorEvent extends EventEmitter {
  /**
   * Creates an instance of RandDataGeneratorEvent.
   * @memberof RandDataGeneratorEvent
   */
  constructor() {
    super();

    this.dataHelper = new DataHelper();

    this.CREATE_CSV = 'createCsv';
    this.ZIP_CSV = 'zipCsv';
    this.ZIP_CSV_RAW = 'zipCsvRaw';
    this.ERROR = 'errorRandData';

    this.createCsvEvent();
    this.zipCsvEvent();
    this.zipCsvRawEvent();
    this.errorEvent();
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  createCsvEvent() {
    this.on(this.CREATE_CSV, async (rowNum, colNum) => {
      const colHeader = [];
      const result = [];

      for (let col = 0; col < colNum; col += 1) {
        const randNum = Math.floor(Math.random() * Math.floor(2));

        colHeader.push(randNum === 0 ? `Str${col}` : `Num${col}`);
      }

      for (let row = 0; row < rowNum; row += 1) {
        const obj = {};

        for (let col = 0; col < colNum; col += 1) {
          const randLength = Math.floor(Math.random() * Math.floor(9)) + 1;

          switch (colHeader[col]) {
            case `Str${col}`:
              obj[`Str${col}`] = RandChar.getRandStr(randLength);
              break;
            case `Num${col}`:
              obj[`Num${col}`] = RandChar.getRandNum(randLength);
              break;
            default:
              break;
          }
        }

        result.push(obj);
      }

      await this.dataHelper.writeCsvFile(result, 'data.csv');
    });
  }

  /**
   *
   *
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  getCreateCsvEventName() {
    return this.CREATE_CSV;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  zipCsvEvent() {
    this.on(this.ZIP_CSV, async (filename) => {
      const fileContent = await this.dataHelper.readFile(filename);

      const records = parse(fileContent, { columns: true, trim: true });

      const secretRecords = await this.dataHelper.reformateRecords(records);

      await this.dataHelper.writeCsvFile(secretRecords, 'secret2-sample.csv');
    });
  }

  /**
   *
   *
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  getZipCsvEventName() {
    return this.ZIP_CSV;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  zipCsvRawEvent() {
    this.on(this.ZIP_CSV_RAW, async (filename) => {
      const fileContent = await this.dataHelper.readFile(filename);

      const lines = fileContent.split(/\r?\n/);

      const secretLines = await this.dataHelper.zipLines(lines);

      await this.dataHelper.writeCsvFile(secretLines, 'secret-raw-sample.csv');
    });
  }

  /**
   *
   *
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  getZipCsvRawEventName() {
    return this.ZIP_CSV_RAW;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
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
   * @memberof RandDataGeneratorEvent
   */
  getErrorEventName() {
    return this.ERROR;
  }
}

module.exports = RandDataGeneratorEvent;
