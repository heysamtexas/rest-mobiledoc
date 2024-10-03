const express = require('express');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const marked = require('marked');


function createApp() {
  const app = express();
  app.use(bodyParser.json());

  // Get the URI_PATH from environment variables, default to '/' if not set
  const uriPath = process.env.URI_PATH || '/';

  // Swagger definition
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
          url: uriPath,
          description: 'Dynamic base path',
        },
      ],
    },
    apis: ['./server.js'], // files containing annotations as above
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use(`${uriPath}api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /:
   *   post:
   *     summary: Convert HTML or Markdown to Mobiledoc
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - source
   *               - payload
   *             properties:
   *               source:
   *                 type: string
   *                 enum: [html, markdown]
   *               payload:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful conversion
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 result:
   *                   type: object
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  app.post(`${uriPath}`, (req, res) => {
    try {
      const { source, payload } = req.body;
      console.log('Received request:', { source, payload });

      if (!source || !payload) {
        return res.status(400).json({ error: 'Missing required fields: source and payload' });
      }

      const result = convertToMobiledoc(payload, source);
      console.log('Conversion result:', result);

      res.json({ result });
    } catch (error) {
      console.error('Error converting to Mobiledoc:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  return app;
}

function convertToMobiledoc(content, source) {
  console.log('Converting to Mobiledoc:', { content, source });
  let htmlContent = content;

  if (source === 'markdown') {
    // Use marked to convert Markdown to HTML
    htmlContent = marked.parse(content);
  } else if (source !== 'html') {
    throw new Error(`Invalid source type: ${source}. Expected 'html' or 'markdown'.`);
  }

  console.log('HTML content:', htmlContent);

  // Parse HTML
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Convert to simplified Mobiledoc format
  const mobiledoc = {
    version: "0.3.1",
    markups: [],
    atoms: [],
    cards: [],
    sections: []
  };

  document.body.childNodes.forEach(node => {
    if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();
      mobiledoc.sections.push([1, tagName, [[0, [], 0, node.textContent]]]);
    } else if (node.nodeType === 3 && node.textContent.trim()) { // Non-empty text node
      mobiledoc.sections.push([1, 'p', [[0, [], 0, node.textContent.trim()]]]);
    }
  });

  console.log('Mobiledoc result:', mobiledoc);
  return mobiledoc;
}

// Only start the server if this file is run directly
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 3000;
  const uriPath = process.env.URI_PATH || '/';


  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}${uriPath}`);
    console.log(`API documentation available at http://localhost:${port}${uriPath}api-docs`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

module.exports = { createApp, convertToMobiledoc };