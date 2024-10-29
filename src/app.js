const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const mobiledocRoutes = require('./routes/mobiledoc.routes');

function createApp() {
  const app = express();
  const uriPath = process.env.URI_PATH || '/';

  app.use(bodyParser.json());
  app.use(`${uriPath}api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(uriPath, mobiledocRoutes);

  return app;
}

module.exports = createApp;
