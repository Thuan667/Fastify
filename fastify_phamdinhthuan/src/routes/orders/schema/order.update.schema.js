const updateOrderSchema = {
    tags: ['orders'],
    summary: 'Update an existing order',
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        total_money: { type: 'number' },
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
              price: { type: 'number' },
            },
          },
        },
      },
    },
    response: {
      200: {
        description: "Order updated successfully",
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          total_money: { type: 'number' },
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
                price: { type: 'number' },
                product_name: { type: 'string' },
                image: { type: 'string' },
              },
            },
          },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      400: {
        description: "Bad request",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      404: {
        description: "Order not found",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: "Internal server error",
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  };
  
  module.exports = updateOrderSchema;
  