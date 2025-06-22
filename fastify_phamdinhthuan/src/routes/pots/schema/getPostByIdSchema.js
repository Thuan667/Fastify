const getPostByIdSchema = {
    description: 'Get one post by ID',
    tags: ['post'],
    summary: 'Get one post',
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' }
        },
        required: ['Authorization']
    },
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string' } // hoặc 'number' nếu bạn dùng số cho ID
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
                image: { type: 'string' },
                user_id: { type: 'number' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
            }
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = getPostByIdSchema;
