const EventEmitter = require('events');
const fs = require('fs');
// const Hashids = require('hashids/cjs');
const path = require('path');
const { isEmpty } = require('lodash');
const stringify = require('csv-stringify');
const parse = require('csv-parse/lib/sync');

const logger = require('../config/logger');
const RandChar = require('../model/RandChar');
const ZlibModel = require('../model/ZlibModel');

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
    this.on(this.CREATE_CSV, (rowNum, colNum) => {
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

      stringify(result, { header: true }, (err, output) => {
        const dirPath = path.join(process.cwd(), '/file');

        fs.writeFileSync(`${dirPath}/data.csv`, output);
      });
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
      const dirPath = path.join(process.cwd(), '/file');

      const fileContent = await fs.readFileSync(`${dirPath}/${filename}`);

      const records = parse(fileContent, { columns: true, trim: true });

      const secretRecords = await this.reformateRecords(records);

      stringify(secretRecords, { header: true }, (err, output) => {
        fs.writeFileSync(`${dirPath}/secret2-sample.csv`, output);
      });
    });
  }

  /**
   *
   *
   * @param {array} records
   * @return {array}
   * @memberof RandDataGeneratorEvent
   */
  async reformateRecords(records) {
    const zlib = new ZlibModel();
    // const hashids = new Hashids('', 10);

    const secretRecords = await Promise.all(
      records.map(async (record) => {
        const body = await zlib.zip(JSON.stringify(record));

        // const datetime = new Date(Date.now());
        // const createdDate = datetime.toUTCString();
        // const uuid = hashids.encode(Number(datetime));

        return { body };
      })
    );

    return secretRecords;
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
      const dirPath = path.join(process.cwd(), '/file');

      const fileContent = await fs.readFileSync(
        `${dirPath}/${filename}`,
        'UTF-8'
      );

      const lines = fileContent.split(/\r?\n/);

      const secretLines = await this.zipLines(lines);

      stringify(secretLines, { header: true }, (err, output) => {
        fs.writeFileSync(`${dirPath}/secret-raw-sample.csv`, output);
      });
    });
  }

  /**
   *
   *
   * @param {array} lines
   * @return {array}
   * @memberof RandDataGeneratorEvent
   */
  async zipLines(lines) {
    const zlib = new ZlibModel();

    const secretRecords = await Promise.all(
      lines.map(async (line) => {
        const body = isEmpty(line) ? '' : await zlib.zip(line);

        return { body };
      })
    );

    return secretRecords;
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

  // async compareZipCsvEvent() {
  //   this.on('compareZipCsv', async (file1, file2) => {
  //     const dirPath = path.join(process.cwd(), '/file');

  //     const fileContent1 = await fs.readFileSync(`${dirPath}/${file1}`);
  //     const fileContent2 = await fs.readFileSync(`${dirPath}/${file2}`);

  //     // const records1 = parse(fileContent1, {col})
  //   });
  // }

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
