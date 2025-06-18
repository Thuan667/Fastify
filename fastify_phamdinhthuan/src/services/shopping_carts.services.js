const getAllCarts = async (db, page, limit, userId = null) => {
    return new Promise((resolve, reject) => {
      let countQuery = 'SELECT COUNT(*) AS total FROM shopping_carts';
      let dataQuery = `
        SELECT 
          c.*, 
          p.product_name, 
          p.price, 
          p.image 
        FROM shopping_carts c
        JOIN products p ON c.product_id = p.id
      `;
  
      const params = [];
      const dataParams = [];
  
      if (userId) {
        countQuery += ' WHERE user_id = ?';
        dataQuery += ' WHERE c.user_id = ?';
        params.push(userId);
        dataParams.push(userId);
      }
  
      dataQuery += ' LIMIT ? OFFSET ?';
      dataParams.push(limit, (page - 1) * limit);
  
      db.query(countQuery, params, (err, countResult) => {
        if (err) return reject(err);
  
        db.query(dataQuery, dataParams, (err, carts) => {
          if (err) return reject(err);
  
          const total = countResult[0].total;
          const pageCount = Math.ceil(total / limit);
  
          // Format lại kết quả
          const formattedCarts = carts.map((cart) => ({
            id: cart.id,
            attributes: {
              user_id: cart.user_id,
              product_id: cart.product_id,
              quantity: cart.quantity,
              price: cart.price,
              created_at: cart.created_at,
              product_name: cart.product_name,
              image: cart.image
            }
          }));
  
          resolve({
            data: formattedCarts,
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
  
  

  const getCartById = async (db, cartId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT c.*, p.product_name, p.price, p.image 
            FROM shopping_carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.id = ?
            `,
            [cartId],
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

const getCartsByUserId = async (db, userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT c.*, p.product_name, p.price, p.image 
            FROM shopping_carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            `, 
            [userId],
            (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) {
                    resolve({ data: [], meta: {} });
                } else {
                    resolve({
                        data: result,
                        meta: {}
                    });
                }
            }
        );
    });
};
 

const createCart = async (db, { user_id, product_id, quantity }) => {
  return new Promise((resolve, reject) => {
    const createdAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Bước 1: Kiểm tra xem đã có sản phẩm trong giỏ hàng của user hay chưa
    const checkQuery = `
      SELECT quantity 
      FROM shopping_carts 
      WHERE user_id = ? AND product_id = ?
    `;

    db.query(checkQuery, [user_id, product_id], (err, result) => {
      if (err) {
        console.error('Check error:', err.message);
        return reject(err);
      }

      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật lại quantity
      if (result.length > 0) {
        const currentQuantity = result[0].quantity;
        const updatedQuantity = currentQuantity + quantity;  // Cộng thêm số lượng mới

        const updateQuery = `
          UPDATE shopping_carts
          SET quantity = ?, created_at = ?
          WHERE user_id = ? AND product_id = ?
        `;

        db.query(updateQuery, [updatedQuantity, createdAt, user_id, product_id], (err, updateResult) => {
          if (err) {
            console.error('Update error:', err.message);
            return reject(err);
          }
          console.log('Updated cart:', updateResult);
          resolve(updateResult);
        });
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thực hiện thêm mới
        const insertQuery = `
          INSERT INTO shopping_carts 
          (user_id, product_id, quantity, created_at)
          VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, [user_id, product_id, quantity, createdAt], (err, insertResult) => {
          if (err) {
            console.error('Insert error:', err.message);
            return reject(err);
          }
          console.log('Created new cart:', insertResult);
          resolve(insertResult);
        });
      }
    });
  });
};


const updateCart = async (db, id, { quantity }) => {
  return new Promise((resolve, reject) => {
      const updatedAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
          .toISOString().slice(0, 19).replace('T', ' ');

      db.query(
          `UPDATE shopping_carts 
           SET quantity = ?,  updated_at = ? 
           WHERE id = ?`,
          [quantity, updatedAt, id],
          (err, result) => {
              if (err) {
                  console.error('Update error:', err.message);
                  return reject(err);
              }
              resolve(result);
          }
      );
  });
};

const deleteCart = async (db, id) => {
  return new Promise((resolve, reject) => {
      db.query(
          `DELETE FROM shopping_carts WHERE id = ?`,
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
const countCartsByUserId = async (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS totalCarts
      FROM shopping_carts
      WHERE user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Count error:', err.message);
        return reject(err);
      }

      const totalCarts = result[0].totalCarts || 0;
      resolve(totalCarts);
    });
  });
};


module.exports = {
  getAllCarts,
  createCart,
  getCartById,
  updateCart,
  deleteCart,
  getCartsByUserId,
  countCartsByUserId,
};
