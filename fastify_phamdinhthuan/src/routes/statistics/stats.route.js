const statsHandler = require('../../handlers/stats.handler');

module.exports = function (fastify, opts, done) {
  fastify.get('/api/admin/stats', statsHandler.getStats);
  done();
};
