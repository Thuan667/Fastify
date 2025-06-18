module.exports = {
  description: 'Khôi phục sản phẩm đã bị xóa mềm',
  tags: ['product'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
