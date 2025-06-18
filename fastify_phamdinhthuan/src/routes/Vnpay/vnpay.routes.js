const { handleCreateOrderAndVNPayUrl, handleVNPayReturn } = require('../../handlers/vnpay.handler');
const createOrderSchema = require('../orders/schema/createOrderSchema');

async function orderRoutes(fastify, options) {
  fastify.post('/orders/create-and-pay', {
    schema: {
      ...createOrderSchema,
      summary: 'Tạo đơn hàng và tạo URL thanh toán VNPay'
    },
    handler: handleCreateOrderAndVNPayUrl
  });

  // fastify.get('/vnpay-return', handleVNPayReturn);
}

module.exports = orderRoutes;
