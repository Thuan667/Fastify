// 📁 services/reviewService.js

async function createReview(db, productId, userId, rating, comment) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [productId, userId, rating, comment],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

function getReviewsByProduct(db, productId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT pr.id, pr.user_id, u.username, pr.rating, pr.comment, pr.created_at, pr.admin_reply, pr.admin_reply_time
       FROM product_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.product_id = ?
       ORDER BY pr.created_at DESC`,
      [productId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}


async function replyToReview(db, reviewId, adminReply) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE product_reviews SET admin_reply = ?, admin_reply_time = NOW() WHERE id = ?`,
      [adminReply, reviewId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}
function getAllReviews(db) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT pr.id, pr.product_id, pr.user_id, u.username, pr.rating, pr.comment, pr.created_at, pr.admin_reply, pr.admin_reply_time
       FROM product_reviews pr
       JOIN users u ON pr.user_id = u.id
       ORDER BY pr.created_at DESC`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}
module.exports = {
  createReview,
  getReviewsByProduct,
  replyToReview,
  getAllReviews
};
