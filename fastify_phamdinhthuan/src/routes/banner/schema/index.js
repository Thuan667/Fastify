const createBannerSchema = require("./banner.create.schema");
const deleteBannerSchema = require("./banner.delete.schema");
const getAllBannersSchema = require("./banner.getall.schema");
const getOneBannerSchema = require("./banner.getone.schema");
const updateBannerSchema = require("./banner.update.schema");

module.exports = {
    getAllBannersSchema,
    getOneBannerSchema,
    createBannerSchema,
    updateBannerSchema,
    deleteBannerSchema,
};
