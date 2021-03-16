const { isEmpty } = require('lodash');
const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify');

const ZlibModel = require('../model/ZlibModel');

/**
 *
 *
 * @class DataHelper
 */
class DataHelper {
  /**
   *
   *
   * @return {string}
   * @memberof DataHelper
   */
  static getFilePath() {
    return path.join(process.cwd(), '/file');
  }

  /**
   *
   *
   * @param {string} filename
   * @return {Buffer}
   * @memberof DataHelper
   */
  async readFile(filename) {
    const data = await fs.readFileSync(
      `${DataHelper.getFilePath()}/${filename}`,
      'UTF-8'
    );

    return data;
  }

  /**
   *
   *
   * @param {array} input
   * @param {string} filename
   * @memberof DataHelper
   */
  async writeCsvFile(input, filename) {
    await stringify(input, { header: true }, (err, output) => {
      fs.writeFileSync(`${DataHelper.getFilePath()}/${filename}`, output);
    });
  }

  /**
   *
   *
   * @param {array} records
   * @return {array}
   * @memberof DataHelper
   */
  async reformateRecords(records) {
    const zlib = new ZlibModel();

    const secretRecords = await Promise.all(
      records.map(async (record) => {
        const body = await zlib.zip(JSON.stringify(record));

        return { body };
      })
    );

    return secretRecords;
  }

  /**
   *
   *
   * @param {array} lines
   * @return {array}
   * @memberof DataHelper
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
}

module.exports = DataHelper;
