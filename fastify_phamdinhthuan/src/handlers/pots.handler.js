const postsService = require('../services/pots.service');

function getAll(req, res) {
    postsService.getAllPosts(this.mysql)
        .then(result => res.send(result))
        .catch(err => {
            console.error('Database error: ', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function getOne(req, res) {
    const id = req.params.id;
    postsService.getPostById(this.mysql, id)
        .then(result => {
            if (!result) {
                res.status(404).send({ error: 'Post not found' });
                return;
            }
            res.send(result);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function createPost(req, res) {
    const data = req.body;

    // Có thể lấy user_id từ token hoặc truyền trực tiếp trong body
    postsService.createPost(this.mysql, data)
        .then(result => postsService.getPostById(this.mysql, result.insertId))
        .then(post => res.send(post))
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function updatePost(req, res) {
    const id = req.params.id;
    const data = req.body;

    postsService.updatePost(this.mysql, data, id)
        .then(async result => {
            if (result.affectedRows === 0) {
                res.status(404).send({ error: 'Post not found' });
                return;
            }
            const post = await postsService.getPostById(this.mysql, id);
            res.send(post);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

async function deletePost(req, res) {
    const id = req.params.id;
    try {
        const post = await postsService.getPostById(this.mysql, id);
        if (!post) {
            res.status(404).send({ error: 'Post not found' });
            return;
        }
        const result = await postsService.deletePost(this.mysql, id);
        if (result.error) {
            res.status(500).send(result);
        } else {
            res.send(post); // trả lại post đã xóa
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAll,
    getOne,
    createPost,
    updatePost,
    deletePost,
};
