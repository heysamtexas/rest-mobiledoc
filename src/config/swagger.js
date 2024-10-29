const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST-mobiledoc API',
      version: '1.0.0',
      description: 'A simple Express API to convert HTML and Markdown to Mobiledoc',
    },
    servers: [
      {
        url: process.env.URI_PATH || '/',
        description: 'Dynamic base path',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Update path to look for route files
};

module.exports = swaggerJsdoc(swaggerOptions);
