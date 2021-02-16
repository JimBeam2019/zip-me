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

    this.createCsvEvent();
    this.zipCsvEvent();
    this.zipCsvRawEvent();
    this.errorEvent();
  }

  /**
   *
   *
   * @param {number} rowNum
   * @param {number} colNum
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  createCsv(rowNum, colNum) {
    if (rowNum > 0 && colNum > 0) {
      this.emit('createCsv', rowNum, colNum);
      return 'Json file is located in the file directory.';
    }

    const errMsg = 'The number of row or column must be greater than zero.';

    this.emit('error', new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  createCsvEvent() {
    this.on('createCsv', (rowNum, colNum) => {
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
   * @param {string} filename
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  zipCsv(filename) {
    if (!isEmpty(filename)) {
      this.emit('zipCsv', filename);
      return 'secret file is already generated.';
    }

    const errMsg = 'The filename is empty.';

    this.emit('error', new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  zipCsvEvent() {
    this.on('zipCsv', async (filename) => {
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
   * @param {string} filename
   * @return {string}
   * @memberof RandDataGeneratorEvent
   */
  zipCsvRaw(filename) {
    if (!isEmpty(filename)) {
      this.emit('zipCsvRaw', filename);
      return 'Raw secret file is already generated.';
    }

    const errMsg = 'The filename is empty.';

    this.emit('error', new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  zipCsvRawEvent() {
    this.on('zipCsvRaw', async (filename) => {
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
      // lines.forEach((line) => {
      //   logger.debug('Line:', { line });
      // });
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
    this.on('error', (error) => {
      logger.error(`Gracefully handling our error: ${error}`);
    });
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  clearAllEvents() {
    this.removeAllListeners('createCsv');
    this.removeAllListeners('zipCsv');
    this.removeAllListeners('error');
  }
}

module.exports = RandDataGeneratorEvent;
