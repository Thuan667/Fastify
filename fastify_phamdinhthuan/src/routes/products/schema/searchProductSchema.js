const searchProductSchema = {
  description: 'Tìm kiếm sản phẩm',
  tags: ['product'],
  querystring: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' }
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
              description: { type: 'string' },
              price: { type: 'number' },
              image: { type: 'string' },
              sale: { type: 'integer' },
              sale_price: { type: 'number' },
              slug: { type: 'string' },
              created_at: { type: 'string' },
              status: { type: 'string' }
            },
            required: ['id', 'product_name'] // Đảm bảo 'id' là bắt buộc
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
