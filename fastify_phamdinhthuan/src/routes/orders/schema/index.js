const createOrderSchema = require('./order.create.schema');
const deleteOrderSchema = require('./order.delete.schema');
const getAllOrdersSchema = require('./order.getall.schema');
const getOneOrderSchema = require('./order.getone.schema');
const updateOrderSchema = require('./order.update.schema');
const getOrdersByUserIdSchema = require('./getOrdersByUserIdSchema');
const getOrdersByUserIdAndStatusSchema = require('./getOrdersByUserIdAndStatusSchema');
const updateOrderStatusByIdSchema = require('./updateOrderStatusByIdSchema')
module.exports = {
    createOrderSchema,
    deleteOrderSchema,
    getAllOrdersSchema,
    getOneOrderSchema,
    updateOrderSchema,
    getOrdersByUserIdSchema,
    getOrdersByUserIdAndStatusSchema,
    updateOrderStatusByIdSchema,
};
