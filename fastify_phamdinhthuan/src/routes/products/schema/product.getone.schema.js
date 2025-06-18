const getOneProductSchema = {
    description: 'Nhận thông tin sản phẩm theo ID',
    tags: ['product'],
    summary: 'Lấy thông tin chi tiết của một sản phẩm',
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'ID của sản phẩm cần lấy' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        attributes: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                product_name: { type: 'string' },
                                product_category: { type: 'string' },
                                description: { type: 'string' },
                                price: { type: 'number' },
                                image: { type: 'string' },
                                sale: { type: 'boolean' },
                                sale_price: { type: 'number' },
                                slug: { type: 'string' },
                                created_at: { type: 'number' },
                                status: { type: 'number' }
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
module.exports = getOneProductSchema;