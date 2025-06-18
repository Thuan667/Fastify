const productsHandler = require('../../handlers/products.handler');
const schema = require('./schema');
const productsSchema = require('./schema');
module.exports = function(fastify, opts, done){

    const onRequest =[
        async (request, reply) => await fastify.authenticate(request,reply),
    ]
    fastify.get('/api/products',{schema:productsSchema.getAllProductsSchema}, productsHandler.getAll);
    fastify.post('/api/products',{schema:productsSchema.createProductSchema},productsHandler.createProduct);
    fastify.get('/api/products/:id', { schema: productsSchema.getOneProductSchema }, productsHandler.getOne);
    fastify.put('/api/products/:id', {schema: productsSchema.updateProductSchema }, productsHandler.updateProduct);
    fastify.delete('/api/products/:id', {schema: productsSchema.deleteProductSchema }, productsHandler.deleteProduct);
    fastify.get('/api/products/search', { schema: productsSchema.searchProductSchema}, productsHandler.searchProducts);

    fastify.get('/api/products/trashed', { schema: productsSchema.getTrashedProductSchema },productsHandler.getTrashedProducts);
fastify.put('/api/products/restore/:id',{ schema: productsSchema.restoreProductSchema },productsHandler.restoreProduct);
fastify.delete('/api/products/trash/:id',{ schema: productsSchema.softDeleteProductSchema },productsHandler.deleteProducttrash);
  fastify.get('/api/products/latest', { schema: productsSchema.getLatestProductsSchema }, productsHandler.getLatestProducts);
  fastify.get('/api/products/discount', { schema: productsSchema.getDiscountedProductsSchema }, productsHandler.getDiscountedProducts);

    done();
}