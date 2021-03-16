const zlib = require('zlib');

/**
 *
 *
 * @class ZlibModel
 */
class ZlibModel {
  /**
   *
   *
   * @param {string} plainData
   * @return {Promise}
   * @memberof ZlibModel
   */
  async zip(plainData) {
    return new Promise((resolve, reject) => {
      zlib.deflate(plainData, (err, buffer) => {
        if (err) {
          reject(new Error('Error: Zlib deflate in compression.'));
        }

        resolve(buffer.toString('base64'));
      });
    });
  }

  /**
   *
   *
   * @param {string} cryptoData
   * @return {Promise}
   * @memberof ZlibModel
   */
  async unzip(cryptoData) {
    const bufferData = Buffer.from(cryptoData, 'base64');

    return new Promise((resolve, reject) => {
      zlib.unzip(bufferData, (err, buffer) => {
        if (err) {
          reject(new Error('Error: Zlib unzip in compression.'));
        }

        resolve(buffer.toString());
      });
    });
  }
}

module.exports = ZlibModel;
