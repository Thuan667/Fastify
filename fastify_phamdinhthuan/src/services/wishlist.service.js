const getAllWishlists = async (db, page, limit, userId = null) => {
  return new Promise((resolve, reject) => {
    let countQuery = 'SELECT COUNT(*) AS total FROM wishlists';
    let dataQuery = `
      SELECT 
        w.*, 
        p.product_name, 
        p.price, 
        p.image 
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
    `;

    const params = [];
    const dataParams = [];

    if (userId) {
      countQuery += ' WHERE user_id = ?';
      dataQuery += ' WHERE w.user_id = ?';
      params.push(userId);
      dataParams.push(userId);
    }

    dataQuery += ' LIMIT ? OFFSET ?';
    dataParams.push(limit, (page - 1) * limit);

    db.query(countQuery, params, (err, countResult) => {
      if (err) return reject(err);

      db.query(dataQuery, dataParams, (err, wishlists) => {
        if (err) return reject(err);

        const total = countResult[0].total;
        const pageCount = Math.ceil(total / limit);

        const formattedWishlists = wishlists.map((item) => ({
          id: item.id,
          attributes: {
            user_id: item.user_id,
            product_id: item.product_id,
            created_at: item.created_at,
            product_name: item.product_name,
            price: item.price,
            image: item.image
          }
        }));

        resolve({
          data: formattedWishlists,
          meta: {
            pagination: {
              page: parseInt(page, 10),
              pageSize: parseInt(limit, 10),
              pageCount,
              total
            }
          }
        });
      });
    });
  });
};

const getWishlistById = async (db, wishlistId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT w.*, p.product_name, p.price, p.image 
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.id = ?
      `,
      [wishlistId],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          resolve({ data: null, meta: {} });
        } else {
          resolve({
            data: result[0],
            meta: {}
          });
        }
      }
    );
  });
};

const getWishlistsByUserId = async (db, userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT w.*, p.product_name, p.price, p.image 
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      `,
      [userId],
      (err, result) => {
        if (err) return reject(err);
        resolve({ data: result, meta: {} });
      }
    );
  });
};

const createWishlist = async (db, { user_id, product_id }) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra xem sản phẩm đã tồn tại trong wishlist của người dùng chưa
    db.query(
      `
      SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?
      `,
      [user_id, product_id],
      (err, result) => {
        if (err) {
          console.error('Query error:', err.message);  // Log chi tiết lỗi tại đây
          return reject({ error: 'Database query error', details: err.message });
        }

        // Nếu sản phẩm đã tồn tại, trả về thông báo lỗi
        if (result.length > 0) {
          return reject({ error: 'Sản phẩm đã có trong danh sách yêu thích.' });
        }

        // Nếu chưa có, tiếp tục thêm sản phẩm vào wishlist
        const createdAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
          .toISOString().slice(0, 19).replace('T', ' ');

        db.query(
          `
          INSERT INTO wishlists 
          (user_id, product_id, created_at)
          VALUES (?, ?, ?)
          `,
          [user_id, product_id, createdAt],
          (err, result) => {
            if (err) {
              console.error('Create error:', err.message);  // Log chi tiết lỗi khi thêm dữ liệu vào
              return reject({ error: 'Database insert error', details: err.message });
            }
            resolve(result);
          }
        );
      }
    );
  });
};



const deleteWishlist = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM wishlists WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.error('Delete error:', err.message);
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};
const updateWishlist = async (db, id, data) => {
  return new Promise((resolve, reject) => {
    const { user_id, product_id } = data;

    // Create SQL query to update the wishlist entry
    const updateQuery = `
      UPDATE wishlists 
      SET user_id = ?, product_id = ? 
      WHERE id = ?;
    `;

    db.query(updateQuery, [user_id, product_id, id], (err, result) => {
      if (err) {
        console.error('Update error:', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
};
const countWishlistsByUserId = async (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS totalWishlists
      FROM wishlists
      WHERE user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Count wishlist error:', err.message);
        return reject(err);
      }

      const totalWishlists = result[0].totalWishlists || 0;
      resolve(totalWishlists);
    });
  });
};
module.exports = {
  getAllWishlists,
  getWishlistById,
  getWishlistsByUserId,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  countWishlistsByUserId
};
