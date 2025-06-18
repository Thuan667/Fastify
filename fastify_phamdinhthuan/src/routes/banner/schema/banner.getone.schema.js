const getBannerByIdSchema = {
    description: 'Get one banner by ID',
    tags: ['banner'],
    summary: 'Get one banner',
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
            id: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                image: { type: 'string' },
                status: { type: 'number' }
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

module.exports = getBannerByIdSchema;
