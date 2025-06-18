const getAll = async (db) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM banners', (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null);
        resolve(result);
      });
    });
  };
  
  const getOne = async (db, id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM banners WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null);
        resolve(result[0]);
      });
    });
  };
  
  const createBanner = async (db, { title, image, status }) => {
    return new Promise((resolve, reject) => {
      // Kiểm tra xem image có giá trị không, nếu không thì sử dụng chuỗi rỗng.
      const imageValue = image || '';  // Nếu image là null hoặc undefined, thay bằng chuỗi rỗng.
  
      // Lấy thời gian tạo banner với múi giờ UTC+7
      const createdAt = new Date(Date.now() + 7 * 3600 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
  
      // Thực hiện query vào cơ sở dữ liệu
      db.query(
        'INSERT INTO banners (title, image, status, created_at) VALUES (?, ?, ?, ?)',
        [title, imageValue, status, createdAt],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  };
  
  const updateBanner = async (db, { title, image, status }, id) => {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('ID is required'));
  
      db.query(
        'UPDATE banners SET title = ?, image = ?, status = ? WHERE id = ?',
        [title, image, status, id],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) return reject(new Error('Banner not found'));
          resolve(result);
        }
      );
    });
  };
  
  const deleteBanner = async (db, id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM banners WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve({ error: 'Banner not found' });
        resolve({ message: 'Banner deleted successfully' });
      });
    });
  };
  
  module.exports = {
    getAll,
    getOne,
    createBanner,
    updateBanner,
    deleteBanner,
  };
  