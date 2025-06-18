const usersService = require('../services/users.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// async function createUser(req, res) {
//     const { username, password, name, email, address, phone } = req.body;

//     if (!username || !password || !email) {
//         return res.status(400).send({ error: 'Username, password, and email are required' });
//     }

//     try {
//         // Mã hóa mật khẩu
//         const saltRounds = 1;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Gọi service để tạo người dùng
//         const result = await usersService.createUser(this.mysql, {
//             username, password: hashedPassword, name, email, address, phone
//         });

//         const id = result.insertId;
//         const user = await usersService.getOne(this.mysql, id);

//         // Trả về thông tin người dùng sau khi tạo
//         res.send(user);
//     } catch (err) {
//         console.error('Database error:', err);
//         res.status(500).send({ error: err.message });
//     }
// }
async function createUser(req, res) {
    const { role, username, password, email, address, phone,name } = req.body;
    // thuc hien ma hoa password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        const result = await usersService.createUser(this.mysql, {
            role,
            username,
            password: hashedPassword,
            email,
            name,
            address,
            phone,

        });
        const id = result.insertId;
        const user = await usersService.getOne(this.mysql, id);
        res.send(user);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: err.message });
    }
}
function getAll(req, res) {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10); // page và limit lấy từ URL có kiểu dữ liệu là string, cần đổi sang int

    // Ví dụ: đường dẫn /users/2/5 trong đó 2 là page và 5 là limit
    const validPage = pageNum > 0 ? pageNum : 1;
    const validLimit = limitNum > 0 ? limitNum : 10;

    // Gọi service để lấy tất cả người dùng với phân trang
    usersService.getAll(this.mysql, validPage, validLimit)
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'No users found' });
                return;
            }

            const formattedResult = {
                data: result.data.map(user => ({
                    id: user.id,
                    attributes: {
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        address: user.address,
                        phone: user.phone,
                        role: user.role,
                        created_at: user.created_at,
                        updated_at: user.updated_at
                    }
                })),
                meta: {
                    pagination: result.meta.pagination
                }
            };
            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
async function getOne(req, res) {
    const { id } = req.params; // Lấy id từ URL params
    try {
        // Lấy thông tin người dùng từ service
        const result = await usersService.getOne(this.mysql, id);

        // Kiểm tra nếu không có dữ liệu người dùng
        if (!result || !result.data) {
            return res.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'User not found'
            });
        }

        // Định dạng lại dữ liệu để trả về
        const formattedResult = {
            data: {
                id: result.data.id, // Lấy id người dùng
                attributes: {
                    username: result.data.username, // Tên người dùng
                    email: result.data.email, // Email người dùng
                    name: result.data.name, // Tên đầy đủ
                    address: result.data.address, // Địa chỉ
                    phone: result.data.phone, // Số điện thoại
                    role: result.data.role, // Vai trò
                    created_at: result.data.created_at, // Thời gian tạo
                    updated_at: result.data.updated_at // Thời gian cập nhật
                }
            },
            meta: result.meta // Phân trang (nếu có)
        };

        res.send(formattedResult); // Trả về kết quả đã định dạng
    } catch (err) {
        console.error('Database error:', err); // Lỗi database
        res.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: err.message
        });
    }
}

// async function login(req, res) {
//     try {
//       const { email, password } = req.body;
//       console.log('📌 Password received from client:', password);
  
//       // Lấy thông tin người dùng từ cơ sở dữ liệu
//       const user = await usersService.login(this.mysql, { email });
  
//       if (!user) {
//         res.status(401).send({ error: 'Unauthorized: User not found' });
//         return;
//       }
  
//       // Kiểm tra mật khẩu
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         res.status(401).send({ error: 'Unauthorized: Incorrect password' });
//         return;
//       }
  
//       // Kiểm tra trường created_at và updated_at hợp lệ
//       const isValidDate = (date) => {
//         return !isNaN(new Date(date).getTime()); // Kiểm tra ngày hợp lệ
//       };
  
//       // Chuyển đổi ngày và đảm bảo các trường này là hợp lệ
//       const response = {
//         jwt: jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' }),
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           name: user.name,
//           address: user.address,
//           phone: user.phone,
//           created_at: isValidDate(user.created_at) ? new Date(user.created_at).toISOString() : null,
//           updated_at: isValidDate(user.updated_at) ? new Date(user.updated_at).toISOString() : null,
//           role: user.role
//         }
//       };
  
//       res.send(response);
//     } catch (err) {
//       console.error('❌ Error in login process:', err);
//       res.status(500).send({ error: 'Internal server error' });
//     }
//   }
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usersService.login(this.mysql, { email });
        if (!user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send({ error: 'Unauthoried' });
            return;
        }
        // tao jwt token
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            console.error('JWT_SECRET_KEY is not set in enviroment variables');
            res.status(500).send({ error: 'Internal Server Error' });
            return;
        }
        const token = jwt.sign({ id: user.id, name: user.username,  role: user.role , phone: user.phone,
                email: user.email,}, secretKey, { expiresIn: '2h' });
        const response = {
            jwt: token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                email: user.email,
                role: user.role,
            }
        };
        res.send(response);
    } catch (err) {
        console.error("Database or bcrypt error", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const result = await usersService.deleteUser(this.mysql, id); // dùng this.mysql giống createUser
        res.send({ message: "Xóa thành công", data: result });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ message: "Lỗi khi xóa người dùng", error: err.message });
    }
}
async function updateUser(req, res) {
    const { id } = req.params;
    const { role, username, password, email, address, phone, name } = req.body;

    try {
        let hashedPassword;

        // Nếu có cập nhật password thì mã hóa lại
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = {
            role,
            username,
            email,
            name,
            address,
            phone,
        };

        // Chỉ thêm password nếu có trong body
        if (hashedPassword) {
            updatedUser.password = hashedPassword;
        }

        // Gọi hàm updateUser trong service
        const result = await usersService.updateUser(this.mysql, id, updatedUser);

        // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Trả lại thông tin người dùng đã cập nhật
        const user = await usersService.getOne(this.mysql, id);
        res.send(user);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ error: err.message });
    }
}

module.exports = {
    createUser,
    getAll,
    getOne,
    login,
    deleteUser,
    updateUser,
}