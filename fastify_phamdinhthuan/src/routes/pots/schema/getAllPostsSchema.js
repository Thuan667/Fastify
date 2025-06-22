const getAllPostsSchema = {
    description: 'Get all posts',
    tags: ['post'],
    summary: 'Get all posts',
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' }
        },
        required: ['Authorization']
    },
    response: {
        200: {
            type: 'array',
            items: {
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
            }
        }
    }
};

module.exports = getAllPostsSchema;
