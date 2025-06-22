const updatePostSchema = {
    description: 'Update a post',
    tags: ['post'],
    summary: 'Update post by ID',
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
            id: { type: 'string' } // hoặc 'number' tùy theo cách bạn định nghĩa id
        }
    },
    body: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string' }
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
        400: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = updatePostSchema;
