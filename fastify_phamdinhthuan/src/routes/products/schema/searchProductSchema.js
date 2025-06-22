const searchProductSchema = {
  description: 'Tìm kiếm sản phẩm nâng cao',
  tags: ['product'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      product_category: { type: 'string' },
      min_price: { type: 'number' },
      max_price: { type: 'number' }
    }
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
              id: { type: 'integer' },
              product_name: { type: 'string' },
              product_category: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              image: { type: 'string' },
              sale: { type: 'integer' },
              sale_price: { type: 'number' },
              slug: { type: 'string' },
              created_at: { type: 'string' },
              status: { type: 'string' }
            },
            required: ['id', 'product_name']
          }
        },
        meta: {
          type: 'object',
          properties: {
            pagination: { type: 'object' }
          }
        }
      }
    }
  }
};

module.exports = searchProductSchema;
