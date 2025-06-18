const getAllFeedbacksSchema = {
    description: 'Get all feedbacks',
    tags: ['feedback'],
    summary: 'Get all feedbacks',
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
                    name: { type: 'string' },
                    email: { type: 'string' },
                    message: { type: 'string' },
                    created_at: { type: 'string' }
                }
            }
        }
    }
};

module.exports = getAllFeedbacksSchema;
