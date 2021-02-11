const express = require("express");

const logger = require("../config/logger");
const RandChar = require("../model/RandChar");
const ZlibModel = require("../model/ZlibModel");

/**
 *
 *
 * @class MainRoute
 */
class MainRoute {
  /**
   * Creates an instance of MainRoute.
   * @memberof MainRoute
   */
  constructor() {
    this.route = express.Router();

    this.runApp();
    this.runRand();
    this.runZip();
  }

  /**
   *
   *
   * @memberof MainRoute
   */
  runApp() {
    // http://localhost:4200/
    this.route.get("/", async (req, res) => {
      res.status(200).send({ code: 200, message: "Welcome mate." });
    });
  }

  runRand() {
    // http://localhost:4200/rand
    this.route.get("/rand", async (req, res) => {
      const randStr = RandChar.getRandStr(9);

      const randNum = RandChar.getRandNum(9);

      res.status(200).send({ code: 200, message: { randStr, randNum } });
    });
  }

  runZip() {
    // http://localhost:4200/zip
    this.route.get("/zip", async (req, res) => {
      const zlib = new ZlibModel();

      const rawStr = "Hello zip zap zop - 123456789";
      const result = await zlib.zip(rawStr);
      const original = await zlib.unzip(result);

      logger.debug("Unzip:", { original });

      res.status(200).send({ code: 200, message: "Zip Done", result });
    });
  }
}

module.exports = MainRoute;
