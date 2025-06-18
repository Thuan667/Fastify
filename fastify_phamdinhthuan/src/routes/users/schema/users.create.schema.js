const createUserSchema = {
    description: 'Create a new user',
    tags: ['user'],
    summary: 'Create a new user',
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                name: { type: 'string' },
                address: { type: 'string' },
                phone: { type: 'string' },
                created_at: { type: 'number' },
                role: { type: 'string' }
            }
        },
        400: {
            description: 'Bad request',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        },
        404: {
            description: 'User not found',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        },
        500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
                statusCode: { type: 'number' },
                error: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
};

module.exports = createUserSchema;
