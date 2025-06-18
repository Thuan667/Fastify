const getOrdersByUserIdAndStatusSchema = {
  description: 'Lấy danh sách đơn hàng của người dùng theo user_id và order_status',
  tags: ['orders'],
  summary: 'Lấy đơn hàng của người dùng theo trạng thái',

  params: {
    type: 'object',
    properties: {
      user_id: { type: 'string', description: 'ID người dùng' }
    },
    required: ['user_id']
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
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              user_id: { type: 'string' },
              total_money: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
              address: { type: 'string' },
              district: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              phone: { type: 'string' },
              provinces: { type: 'string' },
              wards: { type: 'string' },
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    product_id: { type: 'string' },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                    product_name: { type: 'string' },
                    image: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    404: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

module.exports = getOrdersByUserIdAndStatusSchema;