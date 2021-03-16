const { isEmpty } = require('lodash');

const CsvDataGeneratorEvent = require('../event/CsvDataGeneratorEvent');

class CsvDataController {
  /**
   * Creates an instance of CsvDataController.
   * @memberof CsvDataController
   */
  constructor() {
    this.csvDataGenerator = new CsvDataGeneratorEvent();

    this.MULTIPLE_CSV_DATA = this.csvDataGenerator.getMultipleCsvDataEventName();
    this.ERROR = this.csvDataGenerator.getErrorEventName();
  }

  /**
   *
   *
   * @param {string} filename
   * @return {string}
   * @memberof CsvDataController
   */
  multipleCsvData(filename) {
    if (!isEmpty(filename)) {
      this.csvDataGenerator.emit(this.MULTIPLE_CSV_DATA, filename);
      return 'Multiplication is done.';
    }

    const errMsg = 'The filename is empty.';

    this.csvDataGenerator.emit(this.ERROR, new Error(errMsg));
    return errMsg;
  }

  /**
   *
   *
   * @memberof CsvDataController
   */
  clearAllEvents() {
    this.csvDataGenerator.removeAllListeners(this.MULTIPLE_CSV_DATA);
    this.csvDataGenerator.removeAllListeners(this.ERROR);
  }
}

module.exports = CsvDataController;
