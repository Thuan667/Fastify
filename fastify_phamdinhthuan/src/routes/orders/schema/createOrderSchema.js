const createOrderSchema = {
  tags: ['orders'],
  summary: 'Create a new order',
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
    },
    required: ['Authorization'],
  },
  body: {
    type: 'object',
    properties: {
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
            price: { type: 'number' },
          },
        },
      },
    },
    required: ['user_id', 'total_money', 'created_at', 'address', 'district', 'email', 'name', 'phone', 'provinces', 'wards'],
  },
  response: {
    200: {
      description: 'Order created successfully',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        orderId: { type: 'number' },  // hoặc 'string' nếu insertId là string
        paymentUrl: { type: 'string' }
      },
      required: ['success', 'message', 'orderId', 'paymentUrl']
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

module.exports = createOrderSchema;
