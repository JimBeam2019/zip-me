const express = require('express');


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
  }

  /**
   *
   *
   * @memberof MainRoute
   */
  runApp() {
    this.route.get('/', async (req, res) => {
      res.status(200).send({ code: 200, message: 'Welcome mate.' });
    });
  }
}

module.exports = MainRoute;
