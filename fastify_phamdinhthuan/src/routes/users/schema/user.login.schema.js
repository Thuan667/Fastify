const userLoginSchema = {
    description: 'Đăng nhập người dùng',
    tags: ['user'],
    summary: 'Xác thực người dùng với email và mật khẩu',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { 
          type: 'string', 
          format: 'email', 
          description: 'Địa chỉ email của người dùng' 
        },
        password: { 
          type: 'string', 
          description: 'Mật khẩu người dùng' 
        }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          jwt: { 
            type: 'string', 
            description: 'JSON Web Token xác thực người dùng' 
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'ID của người dùng' },
              username: { type: 'string', description: 'Tên đăng nhập của người dùng' },
              email: { type: 'string', description: 'Địa chỉ email của người dùng' },
              name: { type: 'string', description: 'Tên thật của người dùng' },
              address: { type: 'string', description: 'Địa chỉ của người dùng' },
              phone: { type: 'string', description: 'Số điện thoại của người dùng' },
              created_at: { type: 'string', format: 'date-time', description: 'Thời gian người dùng được tạo' },
              role: { type: 'string', description: 'Vai trò của người dùng trong hệ thống' },

            }
          }
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { 
            type: 'string', 
            description: 'Thông báo lỗi khi người dùng không hợp lệ hoặc mật khẩu sai' 
          }
        }
      },
      500: {
        type: 'object',
        properties: {
          error: { 
            type: 'string', 
            description: 'Thông báo lỗi khi có sự cố máy chủ' 
          }
        }
      }
    }
  };
  
  module.exports = userLoginSchema;
  