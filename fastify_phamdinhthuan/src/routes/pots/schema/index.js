const createPostSchema = require("./createPostSchema");
const deletePostSchema = require("./deletePostSchema");
const getAllPostsSchema = require("./getAllPostsSchema");
const getPostByIdSchema = require("./getPostByIdSchema");
const updatePostSchema = require("./updatePostSchema");

module.exports = {
    getAllPostsSchema,
    getPostByIdSchema,
    createPostSchema,
    updatePostSchema,
    deletePostSchema,
};
