const getOneOrderSchema = {
    description: 'Get order details by ID',
    tags: ['orders'],
    summary: 'Get details of a specific order',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of the order to retrieve' },
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
                    quantity: { type: 'number' },
                    product_name: { type: 'string' },
                    price: { type: 'number' },
                    image: { type: 'string' }, // Đảm bảo đúng là `image`
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
  
  module.exports = getOneOrderSchema;
  