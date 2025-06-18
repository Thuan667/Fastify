module.exports = {
  description: 'Xóa mềm sản phẩm (chuyển vào thùng rác)',
  tags: ['product'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer', minimum: 1 },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      },
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      },
    },
  },
};
