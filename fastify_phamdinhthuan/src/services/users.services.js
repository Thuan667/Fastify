const bcrypt = require('bcrypt');
const createUser = async (db, { role, username, password, address, phone, email,name }) => {
    return new Promise((resolve, reject) => {
        try {
            //const createdAt = Date.now();
            db.query(
                'INSERT INTO users (role, username, password, address, phone, email,name) VALUES (?, ?, ?, ?, ?, ?,?)',
                [role, username, password, address, phone, email,name],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                }
            );
        } catch (error) {
            console.error("Database error: ",error);
            reject(error);
        }
    });
};


const getAll = async (db, page, limit) => {
    return new Promise((resolve, reject) => {
        // Đếm tổng số người dùng
        db.query(
            'SELECT COUNT(*) AS total FROM users',
            (err, countResult) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Lấy danh sách người dùng phân trang
                db.query(
                    'SELECT id, username, email, name, address, phone, role, created_at, updated_at FROM users LIMIT ?, ?',
                    [(page - 1) * limit, limit],
                    (err, users) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (users.length === 0) {
                            // Trường hợp không có dữ liệu
                            resolve({
                                data: [],
                                meta: { pagination: { page, pageSize: limit, pageCount: 0, total: 0 } }
                            });
                            return;
                        }

                        // Tính toán số trang và phân trang
                        const total = countResult[0].total;
                        const pageCount = Math.ceil(total / limit);

                        resolve({
                            data: users,
                            meta: {
                                pagination: {
                                    page: parseInt(page, 10),
                                    pageSize: parseInt(limit, 10),
                                    pageCount,
                                    total
                                }
                            }
                        });
                    }
                );
            }
        );
    });
};
const getOne = async (db, userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE id = ?',
            [userId],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (result.length === 0) {
                    resolve({ data: null, meta: { pagination: {} } }); // Trả về null nếu không tìm thấy người dùng
                    return;
                }
                resolve({
                    data: result[0],
                    meta: { pagination: {} } // Không cần phân trang khi chỉ lấy một người dùng
                });
            }
        );
    });
};
// const login = async (db, {email}) => {
//     return new Promise((resolve, reject) => {
//     db.query(
//     'SELECT * FROM users WHERE email = ?',
//     [email],
//     (err, result) => {
//     if(err){
//     reject(err);
//     return;
//     }
//     if(result.length === 0){
//         resolve(null);
//         return;
//     }
//     resolve(result[0]);
// }
//     )
// })
// }
const login = async (db, { email }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result.length === 0) {
            resolve(null);
            return;
          }
          resolve(result[0]);
        }
      );
    });
  };
  const deleteUser = async (db, id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  const updateUser = async (db, id, { role, username, password, address, phone, email, name }) => {
    return new Promise((resolve, reject) => {
        try {
            // Tạo mảng các trường cần cập nhật
            const fields = [];
            const values = [];

            if (role !== undefined) {
                fields.push('role = ?');
                values.push(role);
            }
            if (username !== undefined) {
                fields.push('username = ?');
                values.push(username);
            }
            if (password !== undefined) {
                fields.push('password = ?');
                values.push(password);
            }
            if (address !== undefined) {
                fields.push('address = ?');
                values.push(address);
            }
            if (phone !== undefined) {
                fields.push('phone = ?');
                values.push(phone);
            }
            if (email !== undefined) {
                fields.push('email = ?');
                values.push(email);
            }
            if (name !== undefined) {
                fields.push('name = ?');
                values.push(name);
            }

            // Nếu không có trường nào được gửi lên để cập nhật
            if (fields.length === 0) {
                return resolve({ affectedRows: 0 });
            }

            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);

            db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        } catch (error) {
            console.error("Database error: ", error);
            reject(error);
        }
    });
};

module.exports = {
    createUser,
    getAll,
    getOne,
    login,
    deleteUser,
    updateUser,
}