const getAllBannersSchema = {
    description: 'Get all banners',
    tags: ['banner'],
    summary: 'Get all banners',
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
                    image: { type: 'string' },
                    status: { type: 'number' }
                }
            }
        }
    }
};

module.exports = getAllBannersSchema;
