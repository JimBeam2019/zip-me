const express = require('express');

const logger = require('../config/logger');
const ZlibModel = require('../model/ZlibModel');
const CsvDataController = require('../controller/CsvDataController');
const RandDataController = require('../controller/RandDataController');

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
    this.route.get('/', async (req, res) => {
      res.status(200).send({ code: 200, message: 'Welcome mate.' });
    });
  }

  /**
   *
   *
   * @memberof MainRoute
   */
  runRand() {
    // http://localhost:4200/rand
    this.route.get('/rand', (req, res) => {
      const dataGenerator = new RandDataController();

      const result = dataGenerator.createCsv(1000, 15);

      dataGenerator.clearAllEvents();

      res.status(200).send({ code: 200, result });
    });

    // http://localhost:4200/more/data/:filename
    this.route.get('/more/data/:filename', (req, res) => {
      const csvDataController = new CsvDataController();

      const result = csvDataController.multipleCsvData(req.params.filename);

      csvDataController.clearAllEvents();

      res.status(200).send({ code: 200, result });
    });
  }

  /**
   *
   *
   * @memberof MainRoute
   */
  runZip() {
    // http://localhost:4200/zip
    this.route.get('/zip', async (req, res) => {
      const zlib = new ZlibModel();

      const rawStr = 'Hello zip zap zop - 123456789';
      const result = await zlib.zip(rawStr);
      const original = await zlib.unzip(result);

      logger.debug('Unzip:', { original });

      res.status(200).send({ code: 200, message: 'Zip Done', result });
    });

    // http://localhost:4200/zip-csv/:filename
    this.route.get('/zip-csv/:filename', (req, res) => {
      const dataGenerator = new RandDataController();

      const result = dataGenerator.zipCsv(req.params.filename);

      dataGenerator.clearAllEvents();

      res.status(200).send({ code: 200, result });
    });

    // http://localhost:4200/zip-csv-raw/:filename
    this.route.get('/zip-csv-raw/:filename', (req, res) => {
      const dataGenerator = new RandDataController();

      const result = dataGenerator.zipCsvRaw(req.params.filename);

      dataGenerator.clearAllEvents();

      res.status(200).send({ code: 200, result });
    });
  }
}

module.exports = MainRoute;
