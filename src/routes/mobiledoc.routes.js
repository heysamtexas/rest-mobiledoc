const express = require('express');

const router = express.Router();
const logger = require('../utils/logger');
const MobiledocService = require('../services/mobiledoc.service');

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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', (req, res) => {
  try {
    const { source, payload } = req.body;
    logger.info('Received request:', { source, payload });

    if (!source || !payload) {
      return res.status(400).json({ error: 'Missing required fields: source and payload' });
    }

    const result = MobiledocService.convert(payload, source);
    logger.info('Conversion successful');

    res.json({ result });
  } catch (error) {
    logger.error('Error converting to Mobiledoc:', { error: error.message });
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;
