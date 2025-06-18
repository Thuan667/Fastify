const bannerSchema = require('./schema');
const bannerHandler = require('../../handlers/banner.handler');

module.exports = function (fastify, opts, done) {
  

    fastify.get('/api/banners', { schema: bannerSchema.getAllBannersSchema }, bannerHandler.getAll);
    fastify.get('/api/banners/:id', { schema: bannerSchema.getOneBannerSchema }, bannerHandler.getOne);
    fastify.post('/api/banners', {  schema: bannerSchema.createBannerSchema }, bannerHandler.createBanner);
    fastify.put('/api/banners/:id', {  schema: bannerSchema.updateBannerSchema }, bannerHandler.updateBanner);
    fastify.delete('/api/banners/:id', { schema: bannerSchema.deleteBannerSchema }, bannerHandler.deleteBanner);

    done();
};
