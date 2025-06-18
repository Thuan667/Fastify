const updateFeedbackSchema = {
    description: 'Update a feedback message',
    tags: ['feedback'],
    summary: 'Update feedback by ID',
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
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            message: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' },
                message: { type: 'string' },
                created_at: { type: 'string' }
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

module.exports = updateFeedbackSchema;
