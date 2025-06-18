const getCartsByUserIdSchema = {
    description: 'Get shopping carts by user ID',
    tags: ['shopping-cart'],
    summary: 'Get all shopping carts for a specific user',
    params: {
        type: 'object',
        properties: {
            user_id: { type: 'string', description: 'ID of the user to retrieve carts for' },
        },
        required: ['user_id'],
    },
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' },
        },
        required: ['Authorization'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            product_id: { type: 'string' },
                            quantity: { type: 'number' },
                            user_id: { type: 'string' },
                            active: { type: 'number' },
                            created_at: { type: 'string', format: 'date-time' },
                            product: {
                                type: 'object',
                                properties: {
                                    product_name: { type: 'string' },
                                    price: { type: 'number' },
                                    image: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
        500: {
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
};

module.exports = getCartsByUserIdSchema;
