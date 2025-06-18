const getAllProductsSchema = {
    description: 'Nhận tất cả các sản phẩm có phân trang',
    tags: ['product'],
    summary: 'Lấy danh sách sản phẩm được phân trang',
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
module.exports = getAllProductsSchema;