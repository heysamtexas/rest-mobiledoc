const request = require('supertest');
const createApp = require('../../../src/app');

describe('Mobiledoc Routes', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /', () => {
    test('should convert HTML content', async () => {
      const response = await request(app)
        .post('/')
        .send({
          source: 'html',
          payload: '<p>Hello, world!</p>',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.result).toHaveProperty('version', '0.3.1');
      expect(response.body.result.sections).toHaveLength(1);
      expect(response.body.result.sections[0]).toEqual([1, 'p', [[0, [], 0, 'Hello, world!']]]);
    });

    test('should convert markdown content', async () => {
      const response = await request(app)
        .post('/')
        .send({
          source: 'markdown',
          payload: '# Hello, world!\n\nThis is a paragraph.',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.result).toHaveProperty('version', '0.3.1');
      expect(response.body.result.sections).toHaveLength(2);
      expect(response.body.result.sections[0]).toEqual([1, 'h1', [[0, [], 0, 'Hello, world!']]]);
      expect(response.body.result.sections[1]).toEqual([1, 'p', [[0, [], 0, 'This is a paragraph.']]]);
    });

    test('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields: source and payload');
    });

    test('should return 500 for invalid source', async () => {
      const response = await request(app)
        .post('/')
        .send({
          source: 'invalid',
          payload: 'Hello, world!',
        });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
      expect(response.body).toHaveProperty('details', "Invalid source type: invalid. Expected 'html' or 'markdown'.");
    });
  });
});
