// Require the framework and instantiate it
// CommonJs
const fastify = require('fastify')({
  logger: true
})
const axios = require("axios")
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const ExcelJS = require('exceljs');
const cors = require('@fastify/cors');
const mysqlConnection = require('./configs/connection');
mysqlConnection(fastify);

require('dotenv').config();
var path = require('path');
global.appRoot = path.resolve(__dirname);

fastify.register(require('@fastify/static'),{
  root:path.join(__dirname,'uploads'),
  prefix:'/public/'
})
 // Đăng ký Swagger
fastify.register(require('@fastify/swagger'), {
  routePrefix: '/docs',
  swagger: {
      info: {
          title: 'Test API',
          description: 'Testing the Fastify swagger API',
          version: '0.1.0'
      },
      servers: [
          { url: 'http://localhost:3000', description: 'Development server' }
      ],
      schemes: ['http'], // Chỉ định rõ HTTP
      consumes: ['application/json'],
      produces: ['application/json'],

  },
  exposeRoute: true
});

// Đăng ký Swagger UI
fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
      docExpansion: 'full',
      deepLinking: false
  },
  uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

/////////CORS//////////////
fastify.register(cors, {
  origin:  "http://localhost:3001", // Cho phép tất cả các nguồn (nên thay bằng domain cụ thể khi triển khai sản phẩm)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
});

///////////UPLOAD FILE //////////////////
fastify.register(require('@fastify/multipart'));


//////////////////////////////////////AUTHENTICATION///////////////////////////
const jwt = require('jsonwebtoken');
const { url } = require('inspector');

fastify.decorate("authenticate",async function(request, reply){
  const authorization = request.headers.authorization;
  if(!authorization){
    reply.code(401).send("Unauthorized");
    return;
  }
  const token = authorization.split(" ")[1];
  if(!token){
    reply.code(401).send("Unauthorized");
    return;
  }
  try{
    const secretKey = process.env.JWT_SECRET_KEY;
    request.user = jwt.verify(token,secretKey);
  }catch(err){
    reply.code(401).send("Unauthorized");
    return;
  }
})




// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'worlddd' })
})

fastify.get('/auth', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  try {
    const user = request.user;  // Lấy thông tin người dùng từ request.user

    if (!user) {
      return reply.status(401).send({ message: 'User not authenticated' });
    }

    return reply.send({ users: user });  // Trả về thông tin người dùng
  } catch (error) {
    console.error("Error:", error);
    return reply.status(500).send({ message: 'An error occurred', error: error.message });
  }
});





//import route categories
fastify.register(require('./routes/categories/categories'));
// Run the server!
//import route products
fastify.register(require('./routes/products/products'));
//import route upload 
fastify.register(require('./routes/upload/upload'));
//import user
fastify.register(require('./routes/users/users'));
//import shopping carrts
fastify.register(require('./routes/shoppingcarts/shoppingcarts'));
fastify.register(require('./routes/wishlists/wishlists'));
fastify.register(require('./routes/orders/orders'));
fastify.register(require('./routes/banner/banner'));
fastify.register(require('./routes/Vnpay/vnpay.routes'));
fastify.register(require('./routes/reviews/review'));
fastify.register(require('./routes/feedback/feedback'));
fastify.register(require('./routes/statistics/stats.route'));
fastify.register(require('./routes/pots/pots'));




fastify.setErrorHandler(function (error, request, reply) {
  console.error('Error handler caught error:', error);
  if (error.validation) {
    console.error('Validation errors:', error.validation);
  }
  reply.send(error);
});
//THANH TOAN MOMO
fastify.post("/payment", async (req, reply) => {
  // Lấy thông tin đơn hàng từ request body
  const {
    name,
    email,
    phone,
    address,
    provinces,
    district,
    wards,
    products, // JSON string hoặc mảng object sản phẩm
    total_money,
    user_id // nếu bạn có đăng nhập
  } = req.body;
console.log('body:', req.body); // kiểm tra xem có orderId hay không
  // MoMo config
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  // const secretKey = process.env.MOMO_SECRET_KEY;
  const partnerCode = 'MOMO';
const redirectUrl = 'http://localhost:3001/track-oder';
const ipnUrl = ' https://2e5c-113-22-220-55.ngrok-free.app/momo/callback';
// const redirectUrl = 'http://localhost:3001/momo/redirect';
// const ipnUrl = 'http://localhost:3001/momo/callback';
  const requestType = "payWithMethod";
  const orderInfo = "Thanh toán test với MoMo";
  const amount = total_money.toString();
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  // Tạo raw signature
  const rawSignature = 
    "accessKey=" + accessKey +
    "&amount=" + amount +
    "&extraData=" + extraData +
    "&ipnUrl=" + ipnUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + partnerCode +
    "&redirectUrl=" + redirectUrl +
    "&requestId=" + requestId +
    "&requestType=" + requestType;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  };

  try {
    // 1. Lưu đơn hàng vào DB trước
await new Promise((resolve, reject) => {
  fastify.mysql.query(
    `INSERT INTO orders (
      id, momo_order_id, user_id, total_money, created_at, updated_at,
      address, district, email, name, phone,
      provinces, wards, products, order_status, status
    ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderId,        // id
      orderId,        // momo_order_id
      user_id || null,
      total_money,
      address,
      district,
      email,
      name,
      phone,
      provinces,
      wards,
      JSON.stringify(products),
      'PENDING',
      'PENDING'
    ],
    (err, result) => {
      if (err) return reject(err);
      resolve(result);
    }
  );
});


    // 2. Gửi yêu cầu thanh toán tới MoMo
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    return reply.status(200).send(response.data);
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
    return reply.status(500).send({
      statusCode: 500,
      message: "Lỗi khi tạo đơn hàng hoặc gọi MoMo",
      error: error.response?.data || error.message
    });
  }
});

fastify.get('/momo/redirect', async (request, reply) => {
  return reply.send('✅ Thanh toán thành công. Bạn có thể quay về trang chủ.');
});



fastify.post('/momo/callback', async (request, reply) => {
  const data = request.body;
  console.log("📥 Nhận callback từ MoMo:", data);

  const {
    orderId, requestId, amount, orderInfo, orderType,
    transId, resultCode, message, payType,
    responseTime, extraData, signature, partnerCode
  } = data;

  if (!orderId || !requestId || !amount || !signature) {
    return reply.status(400).send({ message: "Thiếu thông tin bắt buộc từ MoMo" });
  }

  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const accessKey = 'F8BBA842ECF85'; // 🔑 Thêm dòng này – chính là phần còn thiếu!

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `message=${message}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `orderType=${orderType}`,
    `partnerCode=${partnerCode}`,
    `payType=${payType}`,
    `requestId=${requestId}`,
    `responseTime=${responseTime}`,
    `resultCode=${resultCode}`,
    `transId=${transId}`
  ].join('&');

  const expectedSignature = crypto.createHmac('sha256', secretKey)
                                  .update(rawSignature)
                                  .digest('hex');

  console.log("✅ Raw Signature:", rawSignature);
  console.log("✅ Expected Signature:", expectedSignature);
  console.log("✅ MoMo Signature:", signature);

  if (expectedSignature !== signature) {
    console.warn("❌ Sai chữ ký xác minh từ MoMo!");
    return reply.status(400).send({ message: "Chữ ký không hợp lệ!" });
  }

  try {
    if (resultCode === 0) {
      console.log("✅ Thanh toán thành công cho đơn hàng:", orderId);
      await updateOrderStatus(fastify.mysql, orderId, 'PAID', transId);
    } else {
      console.warn("❌ Thanh toán thất bại:", message);
      await updateOrderStatus(fastify.mysql, orderId, 'FAILED', transId);
    }

    return reply.send({ resultCode: 0, message: "Xử lý callback thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật đơn hàng:", error);
    return reply.status(500).send({ resultCode: 1, message: "Lỗi server khi xử lý callback" });
  }
});

async function updateOrderStatus(db, orderId, newStatus, momoTransId = null) {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE orders 
       SET status = ?, 
           momo_trans_id = ?, 
           updated_at = NOW()
       WHERE momo_order_id = ?`,
      [newStatus, momoTransId, orderId],  // ✅ Không còn cập nhật total_money
      (err, result) => {
        if (err) {
          console.error("❌ Lỗi khi cập nhật đơn hàng:", err);
          return reject(err);
        }

        if (result.affectedRows === 0) {
          console.warn("⚠️ Không tìm thấy đơn hàng:", orderId);
        }

        resolve(result);
      }
    );
  });
}





const nodemailer = require("nodemailer");

function queryAsync(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

fastify.post('/forgot-password', async (request, reply) => {
  const { email } = request.body;

  try {
    // 1. Kiểm tra xem email có trong bảng users không
    const rows = await queryAsync(fastify.mysql, 'SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return reply.status(404).send({ message: 'Email không tồn tại' });
    }

    // 2. Tạo mã token reset password
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Lưu token và hạn dùng vào DB
    const expireTime = new Date(Date.now() + 1000 * 60 * 15); // 15 phút
    await queryAsync(fastify.mysql,
      'UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?',
      [resetToken, expireTime, email]
    );

    // 4. Tạo link reset mật khẩu
    const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

    // 5. Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Maxx Sport" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `<p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào liên kết dưới đây để tạo mật khẩu mới:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Liên kết sẽ hết hạn sau 15 phút.</p>`
    };

    await transporter.sendMail(mailOptions);
    return reply.send({ message: 'Email đặt lại mật khẩu đã được gửi.' });

  } catch (error) {
    console.error('Lỗi:', error);
    return reply.status(500).send({ message: 'Đã xảy ra lỗi.' });
  }
});


fastify.post('/reset-password', async (request, reply) => {
  const { token, newPassword } = request.body;

  try {
    const rows = await queryAsync(fastify.mysql,
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expire > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return reply.status(400).send({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const userId = rows[0].id;
const hashedPassword = await bcrypt.hash(newPassword, 10);
    await queryAsync(fastify.mysql,
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?',
      [hashedPassword, userId]
    );

    return reply.send({ message: 'Đặt lại mật khẩu thành công!' });

  } catch (error) {
    console.error('Lỗi:', error);
    return reply.status(500).send({ message: 'Đã xảy ra lỗi.' });
  }
});



fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})