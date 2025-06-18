const getAllOrdersSchema = {
  description: 'Get all orders with pagination',
  tags: ['orders'],
  summary: 'Retrieve list of all orders',
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', default: 1, description: 'Page number for pagination' },
      limit: { type: 'integer', default: 10, description: 'Number of items per page' },
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
              order_status:{ type: 'string' },
              status:{ type: 'string' },

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
        meta: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
                pageCount: { type: 'integer' },
                total: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

module.exports = getAllOrdersSchema;
