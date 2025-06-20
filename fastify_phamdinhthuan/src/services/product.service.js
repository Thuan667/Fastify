
// const getAll = async (db, page, limit, categoryId = null) => {
//     return new Promise((resolve, reject) => {
//         let countQuery = 'SELECT COUNT(*) AS total FROM products';
//         let dataQuery = 'SELECT * FROM products';
//         const params = [];
//         const dataParams = [];

//         if (categoryId) {
//             countQuery += ' WHERE product_category = ?';
//             dataQuery += ' WHERE product_category = ?';
//             params.push(categoryId);
//             dataParams.push(categoryId);
//         }

//         dataQuery += ' LIMIT ? OFFSET ?';
//         dataParams.push(limit, (page - 1) * limit);

//         db.query(countQuery, params, (err, countResult) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             db.query(dataQuery, dataParams, (err, products) => {
//                 if (err) {
//                     reject(err);
//                     return;
//                 }

//                 if (products.length === 0) {
//                     resolve({
//                         data: [],
//                         meta: {
//                             pagination: {
//                                 page,
//                                 pageSize: limit,
//                                 pageCount: 0,
//                                 total: 0
//                             }
//                         }
//                     });
//                     return;
//                 }

//                 const total = countResult[0].total;
//                 const pageCount = Math.ceil(total / limit);

//                 resolve({
//                     data: products,
//                     meta: {
//                         pagination: {
//                             page: parseInt(page, 10),
//                             pageSize: parseInt(limit, 10),
//                             pageCount,
//                             total
//                         }
//                     }
//                 });
//             });
//         });
//     });
// };

const getOne = async (db, productId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM products WHERE id = ?',
            [productId],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.length === 0) {
                    resolve({ data: null, meta: { pagination: {} } });
                    return;
                }
                resolve({
                    data: result[0],
                    meta: { pagination: {} } // Không cần phân trang khi chỉ lấy một sản phẩm
                });
            }
        );
    });
};

function searchProductsByName(db, name) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM products WHERE product_name LIKE ?',
      [`%${name}%`],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        if (results.length === 0) {
          resolve({ data: [], meta: { pagination: {} } });
          return;
        }
        resolve({
          data: results,
          meta: { pagination: {} }
        });
      }
    );
  });
}




const createProduct = async (db, {
    product_name,
    slug,
    product_category,
    image,
    price,
    description,
    sale,
    sale_price,
    status,
  }) => {
    return new Promise((resolve, reject) => {
      const createdAt = new Date(Date.now() + 7 * 60 * 60 * 1000)
        .toISOString().slice(0, 19).replace('T', ' ');
  
      const query = `
        INSERT INTO products 
        (product_name, slug, product_category, image, price, description, sale, sale_price, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.query(
        query,
        [
          product_name,
          slug,
          product_category,
          image,
          price,
          description,
          sale,
          sale_price,
          status,

          createdAt
        ],
        (err, result) => {
          if (err) {
            console.error('Validation:', err.message);
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  };
  
const updateProduct = async (db, id, {
    product_name, slug, product_category, image, price, description  ,  sale,
    sale_price,
  }) => {
    return new Promise((resolve, reject) => {
        const updatedAt = new Date(Date.now() + 7 * 60 * 60 * 1000) // +7h cho Vietnam
        .toISOString().slice(0, 19).replace('T', ' ');
            db.query(
        `UPDATE products 
         SET product_name = ?, slug = ?, product_category = ?, image = ?, price = ?, description = ?,sale = ?,sale_price = ?, updated_at = ? 
         WHERE id = ?`,
        [product_name, slug, product_category, image, price, description,  sale,
            sale_price, updatedAt, id],
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
  
  const deleteProduct = async (db, id) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra shopping_carts
    db.query('SELECT * FROM shopping_carts WHERE product_id = ?', [id], (err, cartRows) => {
      if (err) {
        console.error('Check shopping_carts error:', err.message);
        return reject(err);
      }

      // Kiểm tra wishlists
      db.query('SELECT * FROM wishlists WHERE product_id = ?', [id], (err, wishlistRows) => {
        if (err) {
          console.error('Check wishlists error:', err.message);
          return reject(err);
        }

        if (cartRows.length > 0 || wishlistRows.length > 0) {
          return reject(new Error('Không thể xóa: sản phẩm đang tồn tại trong giỏ hàng hoặc danh sách yêu thích.'));
        }

        // Không có trong cả hai, tiến hành xóa cứng
        db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error('Delete error:', err.message);
            return reject(err);
          }
          resolve(result);
        });
      });
    });
  });
};

  


  const deleteProducttrash = async (db, id) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra shopping_carts
    db.query('SELECT * FROM shopping_carts WHERE product_id = ?', [id], (err, cartRows) => {
      if (err) {
        console.error('Check shopping_carts error:', err.message);
        return reject(err);
      }

      // Kiểm tra wishlists
      db.query('SELECT * FROM wishlists WHERE product_id = ?', [id], (err, wishlistRows) => {
        if (err) {
          console.error('Check wishlists error:', err.message);
          return reject(err);
        }

        if (cartRows.length > 0 || wishlistRows.length > 0) {
          return reject(new Error('Không thể đưa vào thùng rác: sản phẩm đang có trong giỏ hàng hoặc danh sách yêu thích.'));
        }

        // Không có trong cả hai, tiến hành xóa mềm
        db.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error('Soft delete error:', err.message);
            return reject(err);
          }
          resolve(result);
        });
      });
    });
  });
};

const getAll = async (db, page, limit, categoryId = null) => {
  return new Promise((resolve, reject) => {
    let countQuery = 'SELECT COUNT(*) AS total FROM products WHERE deleted_at IS NULL';
    let dataQuery = 'SELECT * FROM products WHERE deleted_at IS NULL';
    const params = [];
    const dataParams = [];

    if (categoryId) {
      countQuery += ' AND product_category = ?';
      dataQuery += ' AND product_category = ?';
      params.push(categoryId);
      dataParams.push(categoryId);
    }

    dataQuery += ' LIMIT ? OFFSET ?';
    dataParams.push(limit, (page - 1) * limit);

    db.query(countQuery, params, (err, countResult) => {
      if (err) {
        reject(err);
        return;
      }

      db.query(dataQuery, dataParams, (err, products) => {
        if (err) {
          reject(err);
          return;
        }

        if (products.length === 0) {
          resolve({
            data: [],
            meta: {
              pagination: {
                page,
                pageSize: limit,
                pageCount: 0,
                total: 0,
              },
            },
          });
          return;
        }

        const total = countResult[0].total;
        const pageCount = Math.ceil(total / limit);

        resolve({
          data: products,
          meta: {
            pagination: {
              page: parseInt(page, 10),
              pageSize: parseInt(limit, 10),
              pageCount,
              total,
            },
          },
        });
      });
    });
  });
};
const getTrashed = async (db, page, limit) => {
  return new Promise((resolve, reject) => {
    const countQuery = 'SELECT COUNT(*) AS total FROM products WHERE deleted_at IS NOT NULL';
    const dataQuery = 'SELECT * FROM products WHERE deleted_at IS NOT NULL LIMIT ? OFFSET ?';

    db.query(countQuery, [], (err, countResult) => {
      if (err) {
        reject(err);
        return;
      }

      db.query(dataQuery, [limit, (page - 1) * limit], (err, products) => {
        if (err) {
          reject(err);
          return;
        }

        const total = countResult[0].total;
        const pageCount = Math.ceil(total / limit);

        resolve({
          data: products,
          meta: {
            pagination: {
              page: parseInt(page, 10),
              pageSize: parseInt(limit, 10),
              pageCount,
              total,
            },
          },
        });
      });
    });
  });
};
const restoreProduct = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE products SET deleted_at = NULL WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.error('Restore error:', err.message);
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};
const getLatestProducts = async (db, limit = 10, categoryId = null) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM products WHERE deleted_at IS NULL';
    const params = [];

    if (categoryId) {
      query += ' AND product_category = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        data: results,
        meta: {
          total: results.length,
        },
      });
    });
  });
};
const getDiscountedProducts = async (db, limit = 10, categoryId = null) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT * FROM products 
      WHERE deleted_at IS NULL 
        AND sale = 1 
        AND sale_price > 0
    `;
    const params = [];

    if (categoryId) {
      query += ' AND product_category = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        data: results,
        meta: {
          total: results.length,
        },
      });
    });
  });
};

module.exports ={
    getAll,
    createProduct,
    getOne,
    updateProduct,
    deleteProduct,
    searchProductsByName,
    deleteProducttrash,
    getTrashed,
restoreProduct,
getLatestProducts,
getDiscountedProducts,
}