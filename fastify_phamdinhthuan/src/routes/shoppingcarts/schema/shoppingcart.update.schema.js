const updateCartSchema = {
    tags: ['shopping-cart'],
    summary: 'Update an existing shopping cart',
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
        product_id: { type: 'string' },
        quantity: { type: 'number' },
        active: { type: 'number' },
      },
    },
    response: {
      200: {
        description: "Shopping cart updated successfully",
        type: 'object',
        properties: {
          id: { type: 'string' },
          product_id: { type: 'string' },
          quantity: { type: 'number' },
          active: { type: 'number' },
          updated_at: { type: 'string', format: 'date-time' },
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
        description: "Shopping cart not found",
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
  module.exports = updateCartSchema;
  