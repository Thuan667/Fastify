// product.getlatest.schema.js

const getLatestProductsSchema = {
  tags: ['product'],
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'string' },          
      product_category: { type: 'string' },  
    },
    required: [] 
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
                  created_at: { type: 'string', format: 'date-time' },
                  status: { type: 'string' },
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

module.exports = getLatestProductsSchema;
