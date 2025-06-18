// schema.js

const getAllProductsSchema = {
  tags: ['product'],
    querystring: {
      
      type: 'object',
      properties: {
        page: { type: 'string' },
        limit: { type: 'string' },
        product_category: { type: 'string' }  // <-- thêm dòng này để lọc theo category
      },
      required: [] // Không bắt buộc cái nào
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: { type: 'array' },
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
  
module.exports = getAllProductsSchema;