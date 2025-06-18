const getTrashedProductSchema = {
  description: 'Lấy danh sách sản phẩm đã bị xóa mềm',
  tags: ['product'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string' },
      limit: { type: 'string' }
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
              id: { type: 'number' },
              attributes: {
                type: 'object',
                properties: {
                  product_name: { type: 'string' },
                  product_category: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  image: { type: 'string' },
                  sale: { type: 'boolean' },
                  sale_price: { type: 'number' },
                  slug: { type: 'string' },
                  created_at: { type: 'string' },
                  deleted_at: { type: 'string' },
                  status: { type: 'string' }
                },
                required: ['product_name']
              }
            },
            required: ['id', 'attributes']
          }
        },
        meta: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                pageSize: { type: 'number' },
                pageCount: { type: 'number' },
                total: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = getTrashedProductSchema;
