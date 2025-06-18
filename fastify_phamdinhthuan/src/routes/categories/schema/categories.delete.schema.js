const deleteCategorySchema = {
    description: 'Delete one category',
    tags: ['category'],
    summary: 'Delete one category by ID',
    headers:{
        type:'object',
        properties:{
            Authorization: { type : 'string'},
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
    response: {
        200: {
            type: 'object',
            properties: {
                category_name: { type: "string" },
                slug: { type: "string" },
                sort_order: { type: "number" },
                parent: { type: "number" },
                status: { type: "number" }
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

module.exports = deleteCategorySchema;
