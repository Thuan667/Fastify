const cartHandler = require('../../handlers/shopping_carts.handler');
const cartSchema = require('./schema');

module.exports = function (fastify, opts, done) {
  fastify.get('/api/carts', { schema: cartSchema.getAllCartsSchema }, cartHandler.getAllCarts);
  
  // Đổi tên tham số trong URL để phân biệt
  fastify.get('/api/carts/user/:user_id', { schema: cartSchema.getCartsByUserIdSchema }, cartHandler.getCarts);  // Lấy giỏ hàng theo user_id
  
  fastify.post('/api/carts', { schema: cartSchema.createCartSchema }, cartHandler.createCart);
  fastify.get('/api/carts/:id', { schema: cartSchema.getOneCartSchema }, cartHandler.getCart);  // Lấy giỏ hàng theo id
  fastify.put('/api/carts/:id', { schema: cartSchema.updateCartSchema }, cartHandler.updateCart);
  fastify.delete('/api/carts/:id', { schema: cartSchema.deleteCartSchema }, cartHandler.deleteCart);
  fastify.get('/api/carts/count', { schema: cartSchema.countCartsByUserId }, cartHandler.countCartItems);
  done();
};
