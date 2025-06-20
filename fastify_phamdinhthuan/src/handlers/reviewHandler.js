// 📁 handlers/reviewHandler.js
const {
  createReview,
  getReviewsByProduct,
  replyToReview,
   getAllReviews, 
   getReviewsByProductId,
   checkReviewExists
} = require('../services/reviewService');
async function getAllReviewsHandler(request, reply) {
  try {
    const reviews = await getAllReviews(request.server.mysql);
    reply.send(reviews);
  } catch (err) {
    console.error('❌ Lỗi khi lấy tất cả đánh giá:', err);
    reply.code(500).send({ message: 'Lỗi khi lấy danh sách đánh giá' });
  }
}
async function createReviewHandler(request, reply) {
  const { productId } = request.params;
  const { rating, comment } = request.body;
  const userId = request.user?.id || 1; // Giả lập user id

  try {
    await createReview(request.server.mysql, productId, userId, rating, comment);
    reply.code(201).send({ message: 'Đánh giá đã được ghi nhận' });
  } catch (err) {
    console.error('❌ Lỗi khi tạo đánh giá:', err);

    // Xử lý lỗi custom từ service
    if (err.message === 'Bạn chưa mua sản phẩm này nên không thể đánh giá.') {
      reply.code(403).send({ message: err.message });
    } else if (err.message === 'Bạn đã đánh giá sản phẩm này rồi.') {
      reply.code(409).send({ message: err.message });
    } else {
      reply.code(500).send({ message: 'Lỗi máy chủ khi tạo đánh giá' });
    }
  }
}


async function getReviewsHandler(request, reply) {
  const { productId } = request.params;

  try {
    const reviews = await getReviewsByProduct(request.server.mysql, productId);
    reply.send(reviews);
  } catch (err) {
    console.error('❌ Lỗi khi lấy đánh giá:', err);
    reply.code(500).send({ message: 'Lỗi khi lấy danh sách đánh giá' });
  }
}

async function adminReplyHandler(request, reply) {
  const { reviewId } = request.params;
  const { reply: adminReply } = request.body;

  try {
    await replyToReview(request.server.mysql, reviewId, adminReply);
    reply.send({ message: 'Đã trả lời đánh giá' });
  } catch (err) {
    console.error('❌ Lỗi khi phản hồi:', err);
    reply.code(500).send({ message: 'Lỗi khi phản hồi đánh giá' });
  }
}
const getReviewsByProductIdHandler = async (req, reply) => {
  const { productId } = req.params;
  const { rating } = req.query;

  try {
    const reviews = await getReviewsByProductId(req.server.mysql, productId, rating);
    reply.send(reviews);
  } catch (err) {
    console.error('Error in getReviewsByProductId handler:', err);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
async function checkReviewHandler(request, reply) {
  const { productId } = request.params;
  const userId = request.user?.id || 1;

  try {
    const reviewed = await checkReviewExists(request.server.mysql, productId, userId);
    reply.send({ reviewed });
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra đánh giá:", err);
    reply.code(500).send({ reviewed: false, message: "Lỗi khi kiểm tra đánh giá" });
  }
}

module.exports = {
  createReviewHandler,
  getReviewsHandler,
  adminReplyHandler,
  getAllReviewsHandler,
   getReviewsByProductId: getReviewsByProductIdHandler,
   checkReviewHandler,
};
