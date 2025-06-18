const updateWishlistSchema = {
  tags: ['wishlist'],
  summary: 'Update an existing wishlist item',
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
      user_id:{type:'string'},
      active: { type: 'number' },
    },
  },
  response: {
    200: {
      description: "Wishlist item updated successfully",
      type: 'object',
      properties: {
        id: { type: 'string' },
        product_id: { type: 'string' },
        user_id:{type:'string'},
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
      description: "Wishlist item not found",
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

module.exports = updateWishlistSchema;
