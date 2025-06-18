const createWishlistSchema = require('./createWishlist.schema');
const deleteWishlistSchema = require('./deleteWishlist.schema');
const getAllWishlistsSchema = require('./getAllWishlists.schema');
const getOneWishlistSchema = require('./getOneWishlist.schema');
const updateWishlistSchema = require('./updateWishlist.schema');
const getWishlistsByUserIdSchema = require('./getWishlistsByUserId.schema');
const countWishlistsByUserId = require("./countWishlistsByUserId");
module.exports = {
    createWishlistSchema,
    deleteWishlistSchema,
    getAllWishlistsSchema,
    getOneWishlistSchema,
    updateWishlistSchema,
    getWishlistsByUserIdSchema,
    countWishlistsByUserId,
}
