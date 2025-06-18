const wishlistHandler = require('../../handlers/wishlist.handler');
const wishlistSchema = require('./schema');

module.exports = function (fastify, opts, done) {
  // Lấy tất cả các wishlist
  fastify.get('/api/wishlists', { schema: wishlistSchema.getAllWishlistsSchema }, wishlistHandler.getAllWishlists);
  
  // Lấy wishlist theo user_id
  fastify.get('/api/wishlists/user/:user_id', { schema: wishlistSchema.getWishlistsByUserIdSchema }, wishlistHandler.getWishlists);
  
  // Tạo một wishlist mới
  fastify.post('/api/wishlists', { schema: wishlistSchema.createWishlistSchema }, wishlistHandler.createWishlist);
  
  // Lấy wishlist theo id
  fastify.get('/api/wishlists/:id', { schema: wishlistSchema.getOneWishlistSchema }, wishlistHandler.getWishlist);
  
  // Cập nhật wishlist theo id
  fastify.put('/api/wishlists/:id', { schema: wishlistSchema.updateWishlistSchema }, wishlistHandler.updateWishlist);
  
  // Xóa wishlist theo id
  fastify.delete('/api/wishlists/:id', { schema: wishlistSchema.deleteWishlistSchema }, wishlistHandler.deleteWishlist);
  
  fastify.get(
    '/api/wishlists/count',
    { schema: wishlistSchema.countWishlistsByUserId },
    wishlistHandler.countWishlistItems
  );
  done();
};
