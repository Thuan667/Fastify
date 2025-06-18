const getOrdersByUserIdSchema = {
    description: 'Lấy danh sách đơn hàng của người dùng theo user_id',
    tags: ['orders'],
    summary: 'Lấy tất cả đơn hàng của người dùng',
    
    params: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'ID của người dùng cần lấy đơn hàng' },
      },
      required: ['user_id'],
    },
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      // required: ['Authorization'],
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
                      product_name: { type: 'string' },  // Thêm tên sản phẩm
                      image: { type: 'string' },          // Thêm hình ảnh sản phẩm
                    },
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
  
  module.exports = getOrdersByUserIdSchema;
  