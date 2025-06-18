const getOneUserSchema = {
    description: 'Nhận thông tin người dùng theo ID',
    tags: ['user'], // Đảm bảo route này có cùng tag 'user'
    summary: 'Lấy thông tin chi tiết của một người dùng',
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'ID của người dùng cần lấy' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        attributes: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                email: { type: 'string' },
                                name: { type: 'string' },
                                address: { type: 'string' },
                                phone: { type: 'string' },
                                role: { type: 'string' },
                                created_at: { type: 'number' },
                                updated_at: { type: 'number' }
                            }
                        }
                    }
                },
                meta: {
                    type: 'object',
                    properties: {
                        pagination: { type: 'object' }
                    }
                }
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

module.exports = getOneUserSchema;
