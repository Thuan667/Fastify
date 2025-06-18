const createBannerSchema = {
    description: 'Create a new banner',
    tags: ['banner'],
    summary: 'Create a new banner',
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' },
        },
        required: ['Authorization'],
    },
    body: {
        type: 'object',
        required: ['title', 'image'],
        properties: {
            title: { type: 'string' },
            image: { type: 'string' },
            status: { type: 'number' }
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                image: { type: 'string' },
                status: { type: 'number' },
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

module.exports = createBannerSchema;
