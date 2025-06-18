const createCategorySchema = require("./categories.create.schema");
const deleteCategorySchema = require("./categories.delete.schema");
const getAllCategoriesSchema = require("./categories.getall.schema");
const getOneCategorySchema = require("./categories.getone.schema");
const updateCategorySchema = require("./categories.update.schema");

module.exports ={
    getAllCategoriesSchema,
    getOneCategorySchema,
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
}