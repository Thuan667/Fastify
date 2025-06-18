const { createOrder } = require('../services/orders.service');
const { createVNPayUrl, verifyVNPay } = require('../utils/vnpay.util');

const handleCreateOrderAndVNPayUrl = async (request, reply) => {
  const db = request.server.mysql;
  const ipAddr = request.ip;
  const {
    user_id, total_money, address, district, email,
    name, phone, provinces, wards, products
  } = request.body;

  try {
    const result = await createOrder(db, {
      user_id, total_money, address, district, email,
      name, phone, provinces, wards, products
    });

    const orderId = result.insertId;
    const paymentUrl = createVNPayUrl(orderId, total_money, ipAddr);

    return reply.send({
      success: true,
      message: 'Tạo đơn hàng và URL thanh toán thành công',
      orderId,
      paymentUrl
    });
  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error);
    return reply.status(500).send({
      success: false,
      message: 'Không thể tạo đơn hàng',
      error: error.message
    });
  }
};

const handleVNPayReturn = async (request, reply) => {
  const db = request.server.mysql;
  const params = { ...request.query };

  if (verifyVNPay(params)) {
    const orderId = params.vnp_TxnRef;
    const responseCode = params.vnp_ResponseCode;

    if (responseCode === '00') {
      try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['paid', orderId]);
        return reply.send('✅ Thanh toán thành công! Đơn hàng đã được xác nhận.');
      } catch (err) {
        console.error('❌ Lỗi cập nhật đơn hàng:', err);
        return reply.status(500).send('Lỗi khi cập nhật đơn hàng');
      }
    } else {
      return reply.send('❌ Thanh toán không thành công hoặc bị hủy.');
    }
  } else {
    return reply.status(400).send('❌ Chữ ký không hợp lệ.');
  }
};

module.exports = {
  handleCreateOrderAndVNPayUrl,
  handleVNPayReturn,
};
