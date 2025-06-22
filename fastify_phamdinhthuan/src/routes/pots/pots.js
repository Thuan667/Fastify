const postSchema = require('./schema');
const postHandler = require('../../handlers/pots.handler');

module.exports = function (fastify, opts, done) {

    fastify.get('/api/posts', { schema: postSchema.getAllPostsSchema }, postHandler.getAll);
    fastify.get('/api/posts/:id', { schema: postSchema.getPostByIdSchema }, postHandler.getOne);
    fastify.post('/api/posts', { schema: postSchema.createPostSchema }, postHandler.createPost);
    fastify.put('/api/posts/:id', { schema: postSchema.updatePostSchema }, postHandler.updatePost);
    fastify.delete('/api/posts/:id', { schema: postSchema.deletePostSchema }, postHandler.deletePost);

    done();
};
