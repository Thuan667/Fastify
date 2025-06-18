const createCartSchema = {
    tags: ['shopping-cart'],
    summary: 'Create a new shopping cart',
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
    body: {
      type: 'object',
      required: ['product_id', 'quantity'],
      properties: {
        product_id: { type: 'string' },
        quantity: { type: 'number' },
        user_id: { type: 'string' },
        active: { type: 'number' },  // 1: active, 0: inactive
      },
    },
    response: {
      200: {
        description: "Shopping cart created successfully",
        type: 'object',
        properties: {
          id: { type: 'string' },
          product_id: { type: 'string' },
          quantity: { type: 'number' },
          user_id: { type: 'string' },
          active: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
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
  module.exports = createCartSchema;
  