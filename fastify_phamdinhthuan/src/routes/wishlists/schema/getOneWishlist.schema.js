const getOneWishlistSchema = {
  description: 'Get wishlist item details by ID',
  tags: ['wishlist'],
  summary: 'Get details of a specific wishlist item',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID of the wishlist item to retrieve' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
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

module.exports = getOneWishlistSchema;
