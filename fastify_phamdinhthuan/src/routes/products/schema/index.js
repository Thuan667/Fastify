const createProductSchema=require('./products.createproduct.schema');
const getOneProductSchema=require('./product.getone.schema');
const getAllProductsSchema=require('./getAllProductsSchema ');
const deleteProductSchema=require('./product.delete.schema');
const updateProductSchema=require('./product.update.schema');
const searchProductSchema= require('./searchProductSchema');
const getTrashedProductSchema = require('./product.gettrashed.schema'); // MỚI
const restoreProductSchema = require('./product.restore.schema');  
const softDeleteProductSchema = require('./product.softdelete.schema');
const getLatestProductsSchema = require('./product.getlatest.schema');
const getDiscountedProductsSchema = require('./product.getlatest.schema');

module.exports ={
    getAllProductsSchema,
    createProductSchema,
    getOneProductSchema,
    deleteProductSchema,
    updateProductSchema,
    searchProductSchema,
      getTrashedProductSchema,
  restoreProductSchema,
  softDeleteProductSchema,
  getLatestProductsSchema,
  getDiscountedProductsSchema,
}