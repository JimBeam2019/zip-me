const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const logger = require('../config/logger');
const RandChar = require('../model/RandChar');

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

    this.batchCreateOjbEvent();
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
  batchCreateOjb(rowNum, colNum) {
    if (rowNum > 0 && colNum > 0) {
      this.emit('batchCreateOjb', rowNum, colNum);
      return 'Json file is located in the file directory.';
    }

    this.emit(
      'error',
      new Error('The number of row or column must be greater than zero.')
    );
    return 'The number of row or column must be greater than zero.';
  }

  /**
   *
   *
   * @memberof RandDataGeneratorEvent
   */
  batchCreateOjbEvent() {
    this.on('batchCreateOjb', (rowNum, colNum) => {
      const result = [];

      for (let row = 0; row < rowNum; row += 1) {
        const obj = {};

        for (let col = 0; col < colNum; col += 1) {
          const randNum = Math.floor(Math.random() * Math.floor(2));
          const randLength = Math.floor(Math.random() * Math.floor(9)) + 1;

          switch (randNum) {
            case 0:
              obj[`Str${col}`] = RandChar.getRandStr(randLength);
              break;
            case 1:
              obj[`Num${col}`] = RandChar.getRandNum(randLength);
              break;
            default:
              break;
          }
        }

        result.push(obj);
      }

      const data = JSON.stringify(result);
      const dirPath = path.join(process.cwd(), '/file');

      fs.writeFileSync(`${dirPath}/data.json`, data);
    });
  }

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
    this.removeAllListeners('batchCreateOjb');
    this.removeAllListeners('error');
  }
}

module.exports = RandDataGeneratorEvent;
