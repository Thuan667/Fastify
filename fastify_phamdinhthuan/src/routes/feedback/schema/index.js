const createFeedbackSchema = require("./feedback.create.schema");
const deleteFeedbackSchema = require("./feedback.delete.schema");
const getAllFeedbacksSchema = require("./feedback.getall.schema");
const getOneFeedbackSchema = require("./feedback.getone.schema");
const updateFeedbackSchema = require("./feedback.update.schema");

module.exports = {
    getAllFeedbacksSchema,
    getOneFeedbackSchema,
    createFeedbackSchema,
    updateFeedbackSchema,
    deleteFeedbackSchema,
};
