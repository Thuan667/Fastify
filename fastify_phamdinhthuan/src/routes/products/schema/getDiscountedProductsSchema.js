const getDiscountedProductsSchema = {
  tags: ['product'],
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'string' },             // số lượng sản phẩm lấy ra (string vì query param)
      product_category: { type: 'string' },  // lọc theo category (có thể không truyền)
    },
    required: [] // Không bắt buộc tham số nào
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
                  sale: { type: 'boolean' },          // true nếu đang khuyến mãi
                  sale_price: { type: 'number' },    // giá khuyến mãi
                  slug: { type: 'string' },
                  created_at: { type: 'string', format: 'date-time' },
                  // Nếu không cần status thì bỏ đi
                }
              }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                limit: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = getDiscountedProductsSchema;
