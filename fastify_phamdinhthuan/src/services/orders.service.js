const createOrder = async (db, { user_id, total_money, address, district, email, name, phone, provinces, wards, products }) => {
    return new Promise((resolve, reject) => {
      const createdAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
        .toISOString().slice(0, 19).replace('T', ' ');
  
      const query = `
        INSERT INTO orders 
        (user_id, total_money, address, district, email, name, phone, provinces, wards, products, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [user_id, total_money, address, district, email, name, phone, provinces, wards, JSON.stringify(products), createdAt, createdAt];
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Create error:', err.message);
          return reject(err);
        }
        resolve(result);
      });
    });
  };
  const updateOrderStatus = async (orderId, status) => {
  const db = await global.fastify.mysql.getConnection();
  try {
    const sql = `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`;
    await db.query(sql, [status, orderId]);
  } finally {
    db.release();
  }
};
  const getProductById = async (db, productId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT id,  product_name, image FROM products WHERE id = ?', [productId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0] || null);
      });
    });
  };
  
  const enrichProducts = async (db, rawProducts) => {
    return await Promise.all(rawProducts.map(async (p) => {
      const info = await getProductById(db, p.product_id);
      return {
        ...p,
        product_name: info?.product_name || 'Unknown',
        image: info?.image || ''
      };
    }));
  };
  
  const getOrdersByUserId = async (db, userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM orders WHERE user_id = ?', [userId], async (err, result) => {
        if (err) return reject(err);
  
        const enriched = await Promise.all(result.map(async (order) => {
          const products = JSON.parse(order.products || '[]');
          const enrichedProducts = await enrichProducts(db, products);
  
          return {
            ...order,
            products: enrichedProducts
          };
        }));
  
        resolve({ data: enriched, meta: {} });
      });
    });
  };
  
  const getOrderById = async (db, orderId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT * FROM orders WHERE id = ?
        `,
        [orderId],
        (err, result) => {
          if (err) return reject(err);
  
          if (result.length === 0) {
            resolve({
              data: null,
              meta: {
                pagination: {
                  page: 1,
                  pageSize: 1,
                  pageCount: 0,
                  total: 0
                }
              }
            });
          } else {
            resolve({
              data: result[0],
              meta: {
                pagination: {
                  page: 1,
                  pageSize: 1,
                  pageCount: 1,
                  total: 1
                }
              }
            });
          }
        }
      );
    });
  };
  
  
  const updateOrder = async (db, { id, total_money, address, district, email, name, phone, provinces, wards, products }) => {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
        .toISOString().slice(0, 19).replace('T', ' ');
  
      const query = `
        UPDATE orders
        SET total_money = ?, address = ?, district = ?, email = ?, name = ?, phone = ?, provinces = ?, wards = ?, products = ?, updated_at = ?
        WHERE id = ?
      `;
      const values = [total_money, address, district, email, name, phone, provinces, wards, JSON.stringify(products), updatedAt, id];
  
    db.query(query, values, (err, result) => {
  if (err) {
    console.error('Update error:', err.message);
    return reject(err);
  }
  console.log('Update result:', result);
  resolve(result);
});

    });
  };
  
  const deleteOrder = async (db, id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM orders WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Delete error:', err.message);
          return reject(err);
        }
        resolve(result);
      });
    });
  };
  
  const getAllOrders = async (db, page, limit) => {
    return new Promise((resolve, reject) => {
      const countQuery = 'SELECT COUNT(*) AS total FROM orders';
      const dataQuery = 'SELECT * FROM orders LIMIT ? OFFSET ?';
      const offset = (page - 1) * limit;
  
      db.query(countQuery, (err, countResult) => {
        if (err) return reject(err);
  
        db.query(dataQuery, [limit, offset], async (err, orders) => {
          if (err) return reject(err);
  
          const enriched = await Promise.all(orders.map(async (order) => {
            const products = JSON.parse(order.products || '[]');
            const enrichedProducts = await enrichProducts(db, products);
            return {
              ...order,
              products: enrichedProducts
            };
          }));
  
          const total = countResult[0].total;
          const pageCount = Math.ceil(total / limit);
  
          resolve({
            data: enriched,
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
const getOrdersByUserIdAndStatus = async (db, userId, status) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM orders WHERE user_id = ? AND order_status = ?', [userId, status], async (err, result) => {
      if (err) return reject(err);

      const enriched = await Promise.all(result.map(async (order) => {
        const products = JSON.parse(order.products || '[]');
        const enrichedProducts = await enrichProducts(db, products);

        return {
          ...order,
          products: enrichedProducts
        };
      }));

      resolve({ data: enriched, meta: {} });
    });
  });
};




const updateOrderStatusById = (db, userId, orderId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE orders SET order_status = ? WHERE user_id = ? AND id = ?';
    db.query(sql, [status, userId, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};




  module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrdersByUserIdAndStatus,
    updateOrderStatusById,
    updateOrderStatus,
  };
  