// 📁 services/reviewService.js

const createReview = async (db, productId, userId, rating, comment) => {
  return new Promise((resolve, reject) => {
    // 1. Lấy tất cả đơn hàng đã giao (order_status = 3) của user
    const sql = `
      SELECT * FROM orders
      WHERE user_id = ? AND order_status = 3
    `;

    db.query(sql, [userId], (err, orders) => {
      if (err) return reject(err);

      let hasPurchased = false;

      for (const order of orders) {
        try {
          const products = JSON.parse(order.products); // parse JSON từ cột products

          if (Array.isArray(products)) {
            const found = products.find(p => p.product_id == productId);
            if (found) {
              hasPurchased = true;
              break;
            }
          }
        } catch (e) {
          console.error("Lỗi parse JSON từ cột products:", e);
        }
      }

      if (!hasPurchased) {
        return reject(new Error("Bạn chưa mua sản phẩm này nên không thể đánh giá."));
      }

      // 2. Kiểm tra đã đánh giá chưa
      const checkSql = `SELECT * FROM product_reviews WHERE product_id = ? AND user_id = ?`;
      db.query(checkSql, [productId, userId], (err, existing) => {
        if (err) return reject(err);

        if (existing.length > 0) {
          return reject(new Error("Bạn đã đánh giá sản phẩm này rồi."));
        }

        // 3. Thêm đánh giá
        const insertSql = `
          INSERT INTO product_reviews (product_id, user_id, rating, comment)
          VALUES (?, ?, ?, ?)
        `;

        db.query(insertSql, [productId, userId, rating, comment], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  });
};


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
const getReviewsByProductId = async (db, productId, rating) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM product_reviews WHERE product_id = ?';
    const params = [productId];

    if (rating) {
      sql += ' AND rating = ?';
      params.push(rating);
    }

    sql += ' ORDER BY created_at DESC';

    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
};
const checkReviewExists = async (db, productId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?`;
    db.query(sql, [productId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0); // true nếu đã đánh giá
    });
  });
};
module.exports = {
  createReview,
  getReviewsByProduct,
  replyToReview,
  getAllReviews,
  getReviewsByProductId,
  checkReviewExists,
};
