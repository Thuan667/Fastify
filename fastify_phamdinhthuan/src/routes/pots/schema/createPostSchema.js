const createPostSchema = {
    description: 'Create a new post',
    tags: ['post'],
    summary: 'Create a new post',
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' },
        },
        required: ['Authorization'],
    },
    body: {
        type: 'object',
        required: ['title', 'content', 'user_id'],
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string' },  // Optional
            user_id: { type: 'number' }
        },
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
            }
        },
        400: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        },
        500: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = createPostSchema;
