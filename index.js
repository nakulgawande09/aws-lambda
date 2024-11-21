const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());

AWS.config.update({ region: "ap-south-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create a new product
app.post("/products", async (req, res) => {
  const { ProductId, Name, Description, Price, Category, Stock } = JSON.parse(
    req.body
  );
  console.log({ body: JSON.parse(req.body) });
  console.log({ ProductId, Name, Description, Price, Category, Stock });
  // Check if all required fields are provided
  const requiredFields = [
    { name: "ProductId", allowNull: false },
    { name: "Name", allowNull: false },
    { name: "Price", allowNull: false },
    { name: "Category", allowNull: false },
    { name: "Stock", allowNull: true },
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = eval(field.name);
    console.log({ value });
    return (value === undefined || value === null) && !field.allowNull;
  });

  if (missingFields.length > 0) {
    console.log(
      `The following fields are missing: ${missingFields
        .map((field) => field.name)
        .join(", ")}`
    );
  }

  const params = {
    TableName: "Products",
    Item: {
      ProductId,
      Name,
      Description,
      Price,
      Category,
      Stock,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error saving product:", error);
    res
      .status(500)
      .json({ error: "Could not create product", errorMessage: error });
  }
});

// Retrieve a product by ID
app.get("/products/:id", async (req, res) => {
  const params = {
    TableName: "Products",
    Key: {
      ProductId: req.params.id,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(data.Item);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not retrieve product", errorMessage: error });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
    const { Name, Description, Price, Category, Stock } = req.body;
    const params = {
        TableName: 'Products',
        Key: { ProductId: req.params.id },
        UpdateExpression: 'set #name = :name, #description = :description, #price = :price, #category = :category, #stock = :stock, UpdatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#name': 'Name',
            '#description': 'Description',
            '#price': 'Price',
            '#category': 'Category',
            '#stock': 'Stock'
        },
        ExpressionAttributeValues: {
            ':name': Name,
            ':description': Description,
            ':price': Price,
            ':category': Category,
            ':stock': Stock,
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await dynamoDB.update(params).promise();
        res.json({ message: 'Product updated successfully', data });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Could not update product', errorMessage: error.message });
    }
})

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  const params = {
    TableName: "Products",
    Key: { ProductId: req.params.id },
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not delete product", errorMessage: error });
  }
});

// Start server to debug
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Instead of starting the server, export the handler
module.exports.handler = serverless(app);
