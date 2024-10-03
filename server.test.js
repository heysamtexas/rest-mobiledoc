const request = require('supertest');
const { createApp, convertToMobiledoc } = require('./server');

let app;

beforeAll(() => {
    app = createApp();
});

describe('Mobiledoc Converter API', () => {
    test('convertToMobiledoc with HTML source', () => {
        const result = convertToMobiledoc('<p>Hello, world!</p>', 'html');
        expect(result).toHaveProperty('version', '0.3.1');
        expect(result.sections).toHaveLength(1);
        expect(result.sections[0]).toEqual([1, 'p', [[0, [], 0, 'Hello, world!']]]);
    });

    test('convertToMobiledoc with Markdown source', () => {
        const result = convertToMobiledoc('# Hello, world!', 'markdown');
        expect(result).toHaveProperty('version', '0.3.1');
        expect(result.sections).toHaveLength(1);
        expect(result.sections[0][1]).toBe('h1');
        expect(result.sections[0][2][0][3]).toBe('Hello, world!');
    });


    test('POST / with HTML source', async () => {
        const response = await request(app)
            .post('/')
            .send({
                source: 'html',
                payload: '<p>Hello, world!</p>'
            });

        console.log('Response body:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body.result).toHaveProperty('version', '0.3.1');
        expect(response.body.result.sections).toHaveLength(1);
        expect(response.body.result.sections[0]).toEqual([1, 'p', [[0, [], 0, 'Hello, world!']]]);
    });

    test('convertToMobiledoc with Markdown source', () => {
        const result = convertToMobiledoc('# Hello, world!\n\nThis is a paragraph.', 'markdown');
        expect(result).toHaveProperty('version', '0.3.1');
        expect(result.sections).toHaveLength(2);
        expect(result.sections[0]).toEqual([1, 'h1', [[0, [], 0, 'Hello, world!']]]);
        expect(result.sections[1]).toEqual([1, 'p', [[0, [], 0, 'This is a paragraph.']]]);
    });

    test('POST / with Markdown source', async () => {
        const response = await request(app)
            .post('/')
            .send({
                source: 'markdown',
                payload: '# Hello, world!\n\nThis is a paragraph.'
            });

        console.log('Response body:', response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body.result).toHaveProperty('version', '0.3.1');
        expect(response.body.result.sections).toHaveLength(2);
        expect(response.body.result.sections[0]).toEqual([1, 'h1', [[0, [], 0, 'Hello, world!']]]);
        expect(response.body.result.sections[1]).toEqual([1, 'p', [[0, [], 0, 'This is a paragraph.']]]);
    });


    test('POST / with missing fields', async () => {
        const response = await request(app)
            .post('/')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required fields: source and payload');
    });

    test('POST / with invalid source', async () => {
        const response = await request(app)
            .post('/')
            .send({
                source: 'invalid',
                payload: 'Hello, world!'
            });

        console.log('Response body:', response.body);

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'Internal server error');
        expect(response.body).toHaveProperty('details', "Invalid source type: invalid. Expected 'html' or 'markdown'.");
    });



});