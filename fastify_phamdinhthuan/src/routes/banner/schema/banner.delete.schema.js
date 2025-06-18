const deleteBannerSchema = {
    description: 'Delete one banner',
    tags: ['banner'],
    summary: 'Delete one banner by ID',
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
                title: { type: 'string' },
                image: { type: 'string' },
                link: { type: 'string' },
                sort_order: { type: 'number' },
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

module.exports = deleteBannerSchema;
