const { isEmpty } = require('lodash');

const RandDataGeneratorEvent = require('../event/RandDataGeneratorEvent');

/**
 *
 *
 * @class RandDataController
 */
class RandDataController {
  /**
   * Creates an instance of RandDataController.
   * @memberof RandDataController
   */
  constructor() {
    this.randDataGenerator = new RandDataGeneratorEvent();

    this.CREATE_CSV = this.randDataGenerator.getCreateCsvEventName();
    this.ZIP_CSV = this.randDataGenerator.getZipCsvEventName();
    this.ZIP_CSV_RAW = this.randDataGenerator.getZipCsvRawEventName();
    this.ERROR = this.randDataGenerator.getErrorEventName();
  }

  /**
   *
   *
   * @param {number} rowNum
   * @param {number} colNum
   * @return {string}
   * @memberof RandDataController
   */
  createCsv(rowNum, colNum) {
    if (rowNum > 0 && colNum > 0) {
      this.randDataGenerator.emit(this.CREATE_CSV, rowNum, colNum);
      return 'Json file is located in the file directory.';
    }

    const errMsg = 'The number of row or column must be greater than zero.';

    this.randDataGenerator.emit(this.ERROR, new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @param {string} filename
   * @return {string}
   * @memberof RandDataController
   */
  zipCsv(filename) {
    if (!isEmpty(filename)) {
      this.randDataGenerator.emit(this.ZIP_CSV, filename);
      return 'secret file is already generated.';
    }

    const errMsg = 'The filename is empty.';

    this.randDataGenerator.emit(this.ERROR, new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @param {string} filename
   * @return {string}
   * @memberof RandDataController
   */
  zipCsvRaw(filename) {
    if (!isEmpty(filename)) {
      this.randDataGenerator.emit(this.ZIP_CSV_RAW, filename);
      return 'Raw secret file is already generated.';
    }

    const errMsg = 'The filename is empty.';

    this.randDataGenerator.emit(this.ERROR, new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @memberof RandDataController
   */
  clearAllEvents() {
    this.randDataGenerator.removeAllListeners(this.CREATE_CSV);
    this.randDataGenerator.removeAllListeners(this.ZIP_CSV);
    this.randDataGenerator.removeAllListeners(this.ZIP_CSV_RAW);
    this.randDataGenerator.removeAllListeners(this.ERROR);
  }
}

module.exports = RandDataController;
