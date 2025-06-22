const getAllPosts = async (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM posts ORDER BY created_at DESC', (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result);
    });
  });
};

const getPostById = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0]);
    });
  });
};

const createPost = async (db, { title, content, image, user_id }) => {
  return new Promise((resolve, reject) => {
    const imageValue = image || '';
    const createdAt = new Date(Date.now() + 7 * 3600 * 1000) // UTC+7
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    db.query(
      'INSERT INTO posts (title, content, image, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
      [title, content, imageValue, user_id, createdAt],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const updatePost = async (db, { title, content, image }, id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error('ID is required'));

    db.query(
      'UPDATE posts SET title = ?, content = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, image, id],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error('Post not found'));
        resolve(result);
      }
    );
  });
};

const deletePost = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return resolve({ error: 'Post not found' });
      resolve({ message: 'Post deleted successfully' });
    });
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
