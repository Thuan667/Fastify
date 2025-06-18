const deleteProductSchema = {
    tags: ['product'],
    summary: 'Delete a product',
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
    response: {
      200: {
        description: "Product deleted successfully",
        type: 'object',
        properties: {
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
  
  module.exports = deleteProductSchema;
  