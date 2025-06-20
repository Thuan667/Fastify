// 📁 routes/reviews/schema/reviewSchema.js
const reviewSchema = {
  type: 'object',
  required: ['rating', 'comment'],
  properties: {
    rating: { type: 'integer', minimum: 1, maximum: 5 },
    comment: { type: 'string' },
  }
};

const adminReplySchema = {
  type: 'object',
  required: ['reply'],
  properties: {
    reply: { type: 'string' }
  }
};

module.exports = { reviewSchema, adminReplySchema };
