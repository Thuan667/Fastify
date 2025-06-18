const createWishlistSchema = {
  tags: ['wishlist'],
  summary: 'Create a new wishlist item',
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
  body: {
    type: 'object',
    required: ['product_id'],
    properties: {
      product_id: { type: 'string' },
      user_id: { type: 'string' },
      active: { type: 'number' }, // 1: active, 0: inactive
    },
  },
  response: {
    200: {
      description: "Wishlist item created successfully",
      type: 'object',
      properties: {
        id: { type: 'string' },
        product_id: { type: 'string' },
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

module.exports = createWishlistSchema;
