const createProductSchema = {
    tags: ['product'], 
    summary: 'Create a new product',
    headers:{
        type:'object',
        properties:{
            Authorization: { type : 'string'},
        },
        required: ['Authorization']
    },
    body: { // ❌ Lỗi: "type: 'object'" đặt sai vị trí, cần đưa vào đây
        type: 'object',
        required: ['product_name', 'product_category', 'description', 'price'],
        properties: {
            product_name: { type: 'string' },
            product_category: { type: 'number' },
            description: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
            sale: { type: 'boolean' },
            sale_price: { type: 'number' },
            slug: { type: 'string' },
            status: { type: 'number' }
        }
    },
    response: {
        200: {
            description: "Product created successfully",
            type: 'object',
            properties: {
                id: { type: 'number' },
                product_name: { type: 'string' },
                product_category: { type: 'number' },
                description: { type: 'string' },
                price: { type: 'number' },
                image: { type: 'string' },
                sale: { type: 'boolean' },
                sale_price: { type: 'number' },
                slug: { type: 'string' },
                status: { type: 'number' },
                created_at: { type: 'string', format: 'date-time' } // ✅ Sửa thành kiểu string datetime
            }
        },
        400: {
            description: "Bad request",
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        },
        404: {
            description: "Product not found",
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        },
        500: {
            description: "Internal server error",
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        }
    }
};

module.exports = createProductSchema;
