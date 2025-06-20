const {
  createReviewHandler,
  getReviewsHandler,
  adminReplyHandler,
  getAllReviewsHandler,
  getReviewsByProductId,
  checkReviewHandler, // ➕ thêm handler
} = require('../../handlers/reviewHandler');

const { reviewSchema, adminReplySchema } = require('../reviews/schema/reviewSchema');

async function reviewRoutes(fastify, options) {
  // Người dùng gửi đánh giá
  fastify.post(
    '/api/products/:productId/reviews',
    { schema: { body: reviewSchema } },
    createReviewHandler
  );
fastify.get('/api/products/:productId/reviews/check', checkReviewHandler);

  // ✅ Admin xem tất cả đánh giá
  fastify.get('/api/admin/reviews', getAllReviewsHandler);

  // Người dùng xem đánh giá sản phẩm
  fastify.get('/api/products/:productId/reviews', getReviewsHandler);

  // Admin trả lời đánh giá
  fastify.post(
    '/api/admin/reviews/:reviewId/reply',
    { schema: { body: adminReplySchema } },
    adminReplyHandler
  );

  // API lấy tất cả đánh giá theo sản phẩm
  fastify.get('/api/reviews/:productId', getReviewsByProductId);
}

module.exports = reviewRoutes;
