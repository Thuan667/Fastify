const getAll = async (db) => {
    return new Promise((resolve, reject) => {
    db.query('SELECT * FROM categories', (err, result) => {
    if(err){
    reject(err);
    return;
    }
    if(result.length === 0){
        resolve(null);
        return;
    }
    resolve(result);

});
});
};

const getOne = async (db, id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM categories WHERE id = ?', [id], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(null); 
                return;
            }
            resolve(result[0]);
        });
    });
};

const createCategory = async(db, {category_name, slug, sort_order, parent,
    status}) => {
    return new Promise((resolve, reject) => {
        const createdAt = new Date(Date.now() + 7 * 60 * 60 * 1000) // +7h cho Vietnam
        .toISOString().slice(0, 19).replace('T', ' ');
    db.query(
    'INSERT INTO categories (category_name, slug, sort_order, parent,status, created_at) VALUES(?, ?, ?, ?, ?, ?) ',
    [category_name, slug, sort_order, parent, status,createdAt],
    (err, result) => {
    if(err){
    console.error('Validation error:', err.message);
    return reject(err);
    }
    resolve(result);
})
    })
    }

    const updateCategory = async (db, { category_name, slug, sort_order, parent, status }, id) => {
        return new Promise((resolve, reject) => {
            // Kiểm tra xem id có tồn tại không
            if (!id) {
                return reject(new Error('ID is required'));
            }
    
            db.query(
                'UPDATE categories SET category_name = ?, slug = ?, sort_order = ?, parent = ?, status = ? WHERE id = ?',
                [category_name, slug, sort_order, parent, status, id], // Xóa dấu phẩy thừa ở đây
                (err, result) => {
                    if (err) {
                        console.error('Update error:', err.message);
                        return reject(err);
                    }
    
                    // Kiểm tra nếu không có bản ghi nào được cập nhật (nếu không tìm thấy id)
                    if (result.affectedRows === 0) {
                        return reject(new Error('Category not found'));
                    }
    
                    resolve(result);
                }
            );
        });
    };
const delCategory = async (db, id) => {
  return new Promise((resolve, reject) => {
    // Bước 1: Kiểm tra có sản phẩm nào thuộc danh mục này không
    const checkProductQuery = 'SELECT COUNT(*) AS productCount FROM products WHERE product_category = ?';
    db.query(checkProductQuery, [id], (err, checkResult) => {
      if (err) {
        console.error('Error checking products:', err.message);
        return reject({ error: 'Lỗi kiểm tra sản phẩm' });
      }

      const count = checkResult[0].productCount;
      if (count > 0) {
        return resolve({
          error: 'Không thể xóa danh mục. Đang có sản phẩm thuộc danh mục này.',
        });
      }

      // Bước 2: Không có sản phẩm, tiến hành xóa danh mục
      const deleteQuery = 'DELETE FROM categories WHERE id = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('Delete category error:', err.message);
          return reject({ error: 'Lỗi khi xóa danh mục' });
        }

        if (result.affectedRows === 0) {
          resolve({ error: 'Không tìm thấy danh mục' });
        } else {
          resolve({ message: 'Xóa danh mục thành công' });
        }
      });
    });
  });
};

    
module.exports={
    getAll,
    getOne,
    createCategory,
    updateCategory,
    delCategory,
}