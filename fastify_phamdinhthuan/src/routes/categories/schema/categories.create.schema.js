
const createCategorySchema = {
    description:'Create a new category',
    tags:['category'],
    summary:'Create a new category',
    headers:{
        type:'object',
        properties:{
            Authorization: { type : 'string'},
        },
        required: ['Authorization']
    },
    body: {
        type: "object",
        required: ["category_name", "slug", "parent"], // Đảm bảo tất cả trường này có mặt
        properties: {
            category_name: { type: "string" },
            slug: { type: "string" },
            sort_order: { type: "number" },
            parent: { type: "number" },
            status: { type: "number" }
        }
    },
    response: {
        200: { 
            type: "object", 
            properties: {
                id: { type: "number" },
                category_name: { type: "string" },
                slug: { type: "string" },
                sort_order: { type: "number" },
                parent: { type: "number" },
                status: { type: "number" },
                create_at: { type: "number" }
            }
        },
        400: {
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        },
        404: { 
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        },
        500: { 
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" }
            }
        }
    }
};
module.exports = createCategorySchema;