const orderHandler = require('../../handlers/orders.handler');
const orderSchema = require('./schema');
const { exportOrdersExcelHandler } = require('../../handlers/orders.handler');

module.exports = function (fastify, opts, done) {
  // Lấy tất cả đơn hàng
  fastify.get('/api/orders', { schema: orderSchema.getAllOrdersSchema }, orderHandler.getAllOrders);
  
  // Lấy đơn hàng theo user_id
  fastify.get('/api/orders/user/:user_id', { schema: orderSchema.getOrdersByUserIdSchema }, orderHandler.getOrdersByUserId);  // Lấy đơn hàng theo user_id
  
  // Tạo đơn hàng mới
  fastify.post('/api/orders', { schema: orderSchema.createOrderSchema }, orderHandler.createOrder);
  
  // Lấy chi tiết đơn hàng theo ID
  fastify.get('/api/orders/:id', { schema: orderSchema.getOneOrderSchema }, orderHandler.getOrder);  // Lấy đơn hàng theo id
  
  // Cập nhật đơn hàng theo ID
  fastify.put('/api/orders/:id', { schema: orderSchema.updateOrderSchema }, orderHandler.updateOrder);
  
  // Xóa đơn hàng theo ID
  fastify.delete('/api/orders/:id', { schema: orderSchema.deleteOrderSchema }, orderHandler.deleteOrder);

 fastify.get(
  '/api/orders/user/:user_id/status',
  { schema: orderSchema.getOrdersByUserIdAndStatusSchema },
  orderHandler.getOrdersByUserIdAndStatus
);

fastify.put(
  '/api/orders/user/:user_id/order/:id/status',
  { schema: orderSchema.updateOrderStatusByIdSchema },
  orderHandler.updateOrderStatusById
);
  fastify.get('/api/orders/export-excel', exportOrdersExcelHandler);

  done();
};
