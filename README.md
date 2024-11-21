# AWS Lambda Product API

A serverless REST API built with AWS Lambda, API Gateway, and DynamoDB for managing product information.

## Features

- Create, Read, Update, Delete (CRUD) operations for products
- Serverless architecture using AWS Lambda
- API Gateway integration with CORS support
- DynamoDB for data persistence
- Express.js for API routing
- Serverless Framework for deployment

## Prerequisites

- Node.js 20.x or later
- AWS Account and configured AWS CLI
- Serverless Framework CLI (`npm install -g serverless`)

## Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/product-api.git
cd product-api
npm install
```

2. Deploy to AWS:

```bash
npm run deploy
```

## API Endpoints

### Create Product

- **POST** `/products`
- **Body:**

```json
{
  "ProductId": "string",
  "Name": "string",
  "Description": "string",
  "Price": number,
  "Category": "string",
  "Stock": number
}
```

### Get Product

- **GET** `/products/{id}`
- Retrieves a product by ID

### Update Product

- **PUT** `/products/{id}`
- **Body:**

```json
{
  "Name": "string",
  "Description": "string",
  "Price": number,
  "Category": "string",
  "Stock": number
}
```

### Delete Product

- **DELETE** `/products/{id}`
- Removes a product by ID

## Project Structure

```
.
├── index.js                 # Main application file with API routes
├── serverless.yml          # Serverless Framework configuration
├── package.json            # Project dependencies
└── .serverless/            # Deployment artifacts
```

## Configuration

The application uses the following AWS services:

- Region: ap-south-1
- Runtime: Node.js 20.x
- DynamoDB table: Products
- IAM Role: Configured for DynamoDB operations

### DynamoDB Schema

```json
{
  "ProductId": "string (Primary Key)",
  "Name": "string",
  "Description": "string",
  "Price": "number",
  "Category": "string",
  "Stock": "number",
  "CreatedAt": "string (ISO Date)",
  "UpdatedAt": "string (ISO Date)"
}
```

## Local Development

To run the application locally, uncomment the server configuration in index.js:

```javascript:index.js
// Start server to debug
const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
 });
```

Then run:

```bash
node index.js
```

## Deployment

The application is deployed using the Serverless Framework. The configuration is defined in `serverless.yml`:

```yaml:serverless.yml
startLine: 1
endLine: 35
```

Deploy using:

```bash
serverless deploy
```

## IAM Permissions

The Lambda function has the following DynamoDB permissions:

- dynamodb:PutItem
- dynamodb:GetItem
- dynamodb:UpdateItem
- dynamodb:DeleteItem

## Error Handling

The API implements standard HTTP status codes:

- 201: Resource Created
- 200: Success
- 404: Resource Not Found
- 500: Server Error

## Security

- CORS enabled for all endpoints
- AWS IAM roles with least privilege access
- DynamoDB encryption at rest
- HTTPS endpoints only

## Dependencies

Main dependencies include:

```json:package.json
"dependencies": {
  "aws-sdk": "^2.1692.0",
  "body-parser": "^1.20.3",
  "express": "^4.21.1",
  "serverless-http": "^3.2.0",
  "uuid": "^11.0.3"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
