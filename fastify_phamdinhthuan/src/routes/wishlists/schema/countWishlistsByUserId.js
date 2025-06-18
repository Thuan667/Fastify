const countWishlistsByUserId = {
  description: 'Đếm số sản phẩm trong danh sách yêu thích theo user_id',
  tags: ['wishlist'],
  querystring: {
    type: 'object',
    required: ['user_id'],
    properties: {
      user_id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

module.exports = countWishlistsByUserId;

