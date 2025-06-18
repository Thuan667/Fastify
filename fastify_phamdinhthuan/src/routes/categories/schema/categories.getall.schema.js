const getAllCategoriesSchema = {
    description: 'Get all categories',
    tags: ['category'],
    summary: 'Get all categories',
    response: {
    200:{
    type: 'array',
    items:{
    type: 'object', 
    properties:{
        id: {type: 'number'},
        category_name: {type: 'string'},
        slug: {type: 'string'},
        sort_order: {type: 'number'},
        parent: {type: 'number'},
        status: {type: 'number'},
        create_at: {type: 'number'}
    }
}
    },
    400: {
        type: 'object' ,
        properties:{
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'}
        },
        example:{
            statusCode: 400,
            error: 'Bad request',
            message: 'Invalid query parameters'
            
            }
            
            },
            // tu lam trg hop 403 404 500 
}
}
module.exports = getAllCategoriesSchema;