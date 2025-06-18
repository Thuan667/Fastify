const getOneCategorySchema = {
    description: 'Get one category',
    tags: ['category'],
    summary: 'Get one category',
    response: {
        200: { 
            type: 'object', // 🔥 Sửa thành object thay vì array
            properties: {
                id: { type: 'number' },
                category_name: { type: 'string' },
                slug: { type: 'string' },
                sort_order: { type: 'number' },
                parent: { type: 'number' },
                status: { type: 'number' },
                create_at: { type: 'number' }
            }
        },
        400: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            },
            example: {
                statusCode: 400,
                error: 'Bad request',
                message: 'Invalid query parameters'
            }
        },
        404: { // 🔥 Thêm trường hợp không tìm thấy
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            },
            example: {
                statusCode: 404,
                error: 'Not Found',
                message: 'Category not found'
            }
        },
        500: { // 🔥 Thêm lỗi server
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            },
            example: {
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Something went wrong'
            }
        }
    }
};
module.exports = getOneCategorySchema;
