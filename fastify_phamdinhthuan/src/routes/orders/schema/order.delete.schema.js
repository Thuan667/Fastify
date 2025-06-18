const createOrderSchema = {
    tags: ['orders'],
    summary: 'Create an order from a shopping cart',
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
    response: {
      201: {
        description: "Order created successfully",
        type: 'object',
        properties: {
          message: { type: 'string' },
          order_id: { type: 'string' },
        },
      },
      400: {
        description: "Invalid input data",
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
  
  module.exports = createOrderSchema;
  