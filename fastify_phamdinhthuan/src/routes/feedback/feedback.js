const feedbackSchema = require('./schema');
const feedbackHandler = require('../../handlers/feedback.handler');

module.exports = function (fastify, opts, done) {

    fastify.get('/api/feedbacks', { schema: feedbackSchema.getAllFeedbacksSchema }, feedbackHandler.getAll);
    fastify.get('/api/feedbacks/:id', { schema: feedbackSchema.getOneFeedbackSchema }, feedbackHandler.getOne);
    fastify.post('/api/feedbacks', { schema: feedbackSchema.createFeedbackSchema }, feedbackHandler.createFeedback);
    fastify.put('/api/feedbacks/:id', { schema: feedbackSchema.updateFeedbackSchema }, feedbackHandler.updateFeedback);
    fastify.delete('/api/feedbacks/:id', { schema: feedbackSchema.deleteFeedbackSchema }, feedbackHandler.deleteFeedback);

    done();
};
