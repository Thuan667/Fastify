// users.delete.schema.js
const deleteUserSchema = {
    description: 'Xóa user theo ID',
    tags: ['user'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
      required: ['id'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      500: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  };
  
  module.exports = deleteUserSchema;
  