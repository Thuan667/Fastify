const getAll = async (db) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM feedbacks', (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result);
    });
  });
};

const getOne = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM feedbacks WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0]);
    });
  });
};

const createFeedback = async (db, { name, email, message }) => {
  return new Promise((resolve, reject) => {
    // Lấy thời gian tạo feedback với múi giờ UTC+7
    const createdAt = new Date(Date.now() + 7 * 3600 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    db.query(
      'INSERT INTO feedbacks (name, email, message, created_at) VALUES (?, ?, ?, ?)',
      [name, email, message, createdAt],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const updateFeedback = async (db, { name, email, message }, id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error('ID is required'));

    db.query(
      'UPDATE feedbacks SET name = ?, email = ?, message = ? WHERE id = ?',
      [name, email, message, id],
      (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error('Feedback not found'));
        resolve(result);
      }
    );
  });
};

const deleteFeedback = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM feedbacks WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return resolve({ error: 'Feedback not found' });
      resolve({ message: 'Feedback deleted successfully' });
    });
  });
};

module.exports = {
  getAll,
  getOne,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
