const getWishlistByUserIdSchema = {
  description: 'Get wishlist items by user ID',
  tags: ['wishlist'],
  summary: 'Get all wishlist items for a specific user',
  params: {
    type: 'object',
    properties: {
      user_id: { type: 'string', description: 'ID of the user to retrieve wishlist items for' },
    },
    required: ['user_id'],
  },
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              product_id: { type: 'string' },
              user_id: { type: 'string' },
              active: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              product: {
                type: 'object',
                properties: {
                  product_name: { type: 'string' },
                  price: { type: 'number' },
                  image: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    404: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

module.exports = getWishlistByUserIdSchema;
