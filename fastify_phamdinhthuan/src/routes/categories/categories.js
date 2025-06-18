const categorySchema = require('./schema');
const categoriesHandler = require('../../handlers/categories.handler');
module.exports = function(fastify, opts, done){

    const onRequest =[
        async (request, reply) => await fastify.authenticate(request,reply),
    ]
    fastify.get('/api/categories',{schema:categorySchema.getAllCategoriesSchema} ,categoriesHandler.getAll);

    fastify.get('/api/categories/:id',{schema:categorySchema.getOneCategorySchema},categoriesHandler.getOne);
    fastify.post('/api/categories',{onRequest,schema:categorySchema.createCategorySchema},categoriesHandler.createCategory);
    fastify.put('/api/categories/:id',{onRequest,schema:categorySchema.updateCategorySchema},categoriesHandler.updateCategory);
    fastify.delete('/api/categories/:id',{onRequest,schema:categorySchema.deleteCategorySchema},categoriesHandler.delCategory);
    done();
}
