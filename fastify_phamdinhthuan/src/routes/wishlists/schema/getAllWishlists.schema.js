const getAllWishlistSchema = {
  description: 'Get all wishlist items with pagination',
  tags: ['wishlist'],
  summary: 'Retrieve list of all wishlist items',
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1', description: 'Page number for pagination' },
      limit: { type: 'string', default: '10', description: 'Number of items per page' },
    },
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
        meta: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                pageSize: { type: 'number' },
                pageCount: { type: 'number' },
                total: { type: 'number' },
              },
            },
          },
        },
      },
    },
    400: {
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

module.exports = getAllWishlistSchema;
