# REST-mobiledoc

## Purpose

REST-mobiledoc is an Express.js-based API that converts HTML and Markdown content into the Mobiledoc format. This project provides a simple and efficient way to transform content for use in Mobiledoc-compatible editors or content management systems.

## Why We Made It

We created REST-mobiledoc to bridge the gap between common content formats (HTML and Markdown) and the Mobiledoc format. This tool is particularly useful for developers and content creators who need to:

1. Migrate existing content to Mobiledoc-based systems
2. Provide a conversion layer in their content pipeline
3. Easily transform user-generated content into a Mobiledoc-compatible format

By offering this as a REST API, we've made it easy to integrate into various 
workflows and applications, regardless of the programming language or platform 
they use.

## Running the docker image
Sorry, there is no free docker image hosting. I don't use DockerHub. You can 
build the image yourself and run it locally. To run the docker image, you can 
use the following command:

```bash
docker build -t rest-mobiledoc .
docker run -p 3000:3000 -d --name rest-mobiledoc ghcr.io/yourusername/rest-mobiledoc:latest
```

## Features

- Convert HTML to Mobiledoc
- Convert Markdown to Mobiledoc
- RESTful API interface
- Swagger documentation for easy API exploration
- Comprehensive error handling
- Fully tested with Jest

## Local Development Setup

To set up REST-mobiledoc in your local development environment, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/REST-mobiledoc.git
   cd REST-mobiledoc
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The server will start running at `http://localhost:3000`. You can access the Swagger documentation at `http://localhost:3000/api-docs`.

## Running Tests

To run the test suite:

```
npm test
```

## API Usage

The API exposes a single endpoint:

- `POST /`

Request body:

```json
{
  "source": "html" | "markdown",
  "payload": "Your content here"
}
```

Response:

```json
{
  "result": {
    "version": "0.3.1",
    "markups": [],
    "atoms": [],
    "cards": [],
    "sections": [
      // Mobiledoc sections here
    ]
  }
}
```

For detailed API documentation, refer to the Swagger UI available at `/api-docs` when running the server.

## API Documentation

Once the server is running, you can access the API documentation by visiting:

```
http://localhost:3000/api-docs
```

This will open the Swagger UI, where you can see detailed information about the API endpoints, try out the API directly from the browser, and see example requests and responses.

The API has one main endpoint:

- `POST /`: Convert HTML or Markdown to Mobiledoc

To use the API, send a POST request to the root URL (`/`) with a JSON body containing:

- `source`: Either "html" or "markdown"
- `payload`: The content to be converted

Example request body:

```json
{
  "source": "markdown",
  "payload": "# Hello, world!\n\nThis is a test."
}
```

The API will respond with the converted Mobiledoc content.

## API Usage Example

Here's an example of how to use the API with curl:

```bash
curl -X POST https://api.joat.tools \
     -H "Content-Type: application/json" \
     -d '{
       "source": "markdown",
       "payload": "# Welcome to REST-mobiledoc\n\nThis is a sample Markdown document.\n\n## Features\n\n- Converts Markdown to Mobiledoc\n- Easy to use API\n- Lightweight and fast"
     }'
```

This command sends a POST request to the API with a Markdown payload. The API should respond with the converted Mobiledoc content.


## Contributing

We welcome contributions to REST-mobiledoc! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## Issues

If you encounter any problems or have feature requests, please file an issue on the GitHub issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Acknowledgments

- Express.js for the web framework
- Marked for Markdown parsing
- JSDOM for HTML parsing
- Jest for testing
- Swagger for API documentation

Thank you to all contributors who have helped shape and improve REST-mobiledoc!