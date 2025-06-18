const updateOrderStatusByIdSchema = {
  description: 'Cập nhật trạng thái đơn hàng theo user_id và id',
  tags: ['orders'],
  summary: 'Cập nhật trạng thái đơn hàng',

  params: {
    type: 'object',
    properties: {
      user_id: { type: 'string', description: 'ID người dùng' },
      id: { type: 'string', description: 'ID đơn hàng' }
    },
    required: ['user_id', 'id']
  },
  querystring: {
    type: 'object',
    properties: {
      status: { type: 'string', description: 'Trạng thái đơn hàng' }
    },
    required: ['status']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        updatedCount: { type: 'number' },
        message: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
module.exports= updateOrderStatusByIdSchema;