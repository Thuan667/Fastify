const getOneCartSchema = {
  description: 'Get shopping cart details by ID',
  tags: ['shopping-cart'],
  summary: 'Get details of a specific shopping cart',
  params: {
      type: 'object',
      properties: {
          id: { type: 'string', description: 'ID of the shopping cart to retrieve' },
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
                      product_id: { type: 'string' },
                      quantity: { type: 'number' },
                      user_id: { type: 'string' },
                      active: { type: 'number' },
                      created_at: { type: 'string', format: 'date-time' },
                      product: {
                          type: 'object',
                          properties: {
                              product_name: { type: 'string' },
                              price: { type: 'number' },
                              image: { type: 'string' }, // Đảm bảo đúng là `image`
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
module.exports = getOneCartSchema;
