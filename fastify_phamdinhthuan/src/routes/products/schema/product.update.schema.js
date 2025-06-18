const updateProductSchema = {
    tags: ['product'],
    summary: 'Update an existing product',
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        product_name: { type: 'string' },
        product_category: { type: 'number' },
        description: { type: 'string' },
        price: { type: 'number' },
        image: { type: 'string' },
        sale: { type: 'boolean' },
        sale_price: { type: 'number' },
        slug: { type: 'string' },
        status: { type: 'number' },
      },
    },
    response: {
      200: {
        description: "Product updated successfully",
        type: 'object',
        properties: {
          id: { type: 'number' },
          product_name: { type: 'string' },
          product_category: { type: 'number' },
          description: { type: 'string' },
          price: { type: 'number' },
          image: { type: 'string' },
          sale: { type: 'boolean' },
          sale_price: { type: 'number' },
          slug: { type: 'string' },
          status: { type: 'number' },
          updated_at: { type: 'string', format: 'date-time' }
        },
      },
      400: {
        description: "Bad request",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      404: {
        description: "Product not found",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: "Internal server error",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  };
  
  module.exports = updateProductSchema;
  