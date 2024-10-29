const logger = require('./utils/logger');
const createApp = require('./app');

function startServer() {
  const app = createApp();
  const port = process.env.PORT || 3000;
  const uriPath = process.env.URI_PATH || '/';

  const server = app.listen(port, () => {
    logger.info('Server started', {
      port,
      uri: `http://localhost:${port}${uriPath}`,
      docs: `http://localhost:${port}${uriPath}api-docs`,
    });
  });

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        logger.error('Port requires elevated privileges', { port });
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error('Port is already in use', { port });
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });
    process.exit(1);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp };
