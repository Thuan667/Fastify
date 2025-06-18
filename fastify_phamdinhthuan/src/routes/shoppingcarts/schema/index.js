const createCartSchema = require('./shoppingcart.create.schema');
const deleteCartSchema = require('./shoppingcart.delete.schema');
const getAllCartsSchema = require('./shoppingcart.getall.schema');
const getOneCartSchema = require('./shoppingcart.getone.schema');
const updateCartSchema = require('./shoppingcart.update.schema');
const getCartsByUserIdSchema = require('./getCartsByUserIdSchema');
const countCartsByUserId = require('./countCartItemsSchema');
module.exports ={
    createCartSchema,
    deleteCartSchema,
    getAllCartsSchema,
    getOneCartSchema,
    updateCartSchema,
    getCartsByUserIdSchema,
    countCartsByUserId,
}
