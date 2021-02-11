const App = require('./config/app');
const logger = require('./config/logger');

const { app } = new App();

app.listen(4200, () => {
  logger.verbose('Server is running on http://localhost:4200');
});
