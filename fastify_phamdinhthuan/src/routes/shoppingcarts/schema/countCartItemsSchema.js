const countCartsByUserId = {
  description: 'Đếm tổng số sản phẩm trong giỏ hàng theo user_id',
  tags: ['shopping-cart'],
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

module.exports = 
  countCartsByUserId;

