const express = require('express');

const MainRoute = require('../route/MainRoute');

/**
 *
 *
 * @class App
 */
class App {
  /**
   * Creates an instance of App.
   * @memberof App
   */
  constructor() {
    this.app = express();
    this.config();
  }

  /**
   *
   *
   * @memberof App
   */
  config() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    const mainRoute = new MainRoute().route;

    this.app.use('/', mainRoute);
  }
}

module.exports = App;
