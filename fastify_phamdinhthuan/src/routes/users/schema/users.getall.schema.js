const getAllUsersSchema = {
    description: 'Nhận tất cả người dùng có phân trang',
    tags: ['user'],
    summary: 'Lấy danh sách người dùng được phân trang',
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'string', default: '1', description: 'Số trang của phân trang' },
            limit: { type: 'string', default: '10', description: 'Số lượng mục trên một trang' }
        }
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
                    }
                },
                meta: {  // Đưa meta vào đúng chỗ trong 200
                    type: 'object',
                    properties: {
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                pageSize: { type: 'number' },
                                pageCount: { type: 'number' },
                                total: { type: 'number' }
                            }
                        }
                    }
                }
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

module.exports = getAllUsersSchema;
