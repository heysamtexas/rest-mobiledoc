const express = require('express');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const marked = require('marked');


function createApp() {
  const app = express();
  app.use(bodyParser.json());

  // OpenAPI definition
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Mobiledoc Converter API',
        version: '1.0.0',
        description: 'API for converting HTML and Markdown to Mobiledoc format',
      },
    },
    apis: ['./server.js'], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.post('/', (req, res) => {
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









module.exports = { createApp, convertToMobiledoc };