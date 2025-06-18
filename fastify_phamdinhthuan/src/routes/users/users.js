const usersHandler = require('../../handlers/users.handler');
const schema = require('./schema');
const usersSchema = require('./schema');

module.exports = function(fastify, opts, done){
    fastify.get('/api/users',{schema:usersSchema.getAllUsersSchema},usersHandler.getAll);
    fastify.get('/api/users/:id',{schema:usersSchema.getOneUserSchema},usersHandler.getOne);
    fastify.post('/api/users/login',{schema:usersSchema.userLoginSchema},usersHandler.login);
    fastify.post('/api/users',{schema:usersSchema.createUserSchema},usersHandler.createUser);
    fastify.delete('/api/users/:id',{schema:usersSchema.deleteUserSchema},usersHandler.deleteUser);
    fastify.put('/api/users/:id',{schema:usersSchema.updateUserSchema},usersHandler.updateUser);
    done();
}