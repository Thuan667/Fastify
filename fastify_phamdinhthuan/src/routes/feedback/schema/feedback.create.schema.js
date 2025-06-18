const createFeedbackSchema = {
    description: 'Create a new feedback',
    tags: ['feedback'],
    summary: 'Create a new feedback',
    headers: {
        type: 'object',
        properties: {
            Authorization: { type: 'string' },
        },
        required: ['Authorization'],
    },
    body: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            message: { type: 'string' }
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' },
                message: { type: 'string' },
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

module.exports = createFeedbackSchema;
