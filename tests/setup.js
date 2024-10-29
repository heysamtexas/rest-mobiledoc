process.env.NODE_ENV = 'test';
// Silence logger during tests
const logger = require('../src/utils/logger');

logger.transports.forEach((t) => (t.silent = true));
