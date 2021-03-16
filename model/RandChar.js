/**
 *
 *
 * @class RandChar
 */
class RandChar {
  /**
   *
   *
   * @static
   * @param {number} length
   * @return {string}
   * @memberof RandChar
   */
  static getRandStr(length) {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, length);
  }

  /**
   *
   *
   * @static
   * @param {number} length
   * @return {string}
   * @memberof RandChar
   */
  static getRandNum(length) {
    return Number(
      Math.random()
        .toString(36)
        .replace(/[^0-9]+/g, '')
        .substr(0, length)
    );
  }

  /**
   *
   *
   * @static
   * @param {number} max
   * @return {number}
   * @memberof RandChar
   */
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

module.exports = RandChar;
