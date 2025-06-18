const feedbackService = require('../services/feedback.service');

function getAll(req, res) {
    feedbackService.getAll(this.mysql)
        .then(result => res.send(result))
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function getOne(req, res) {
    const id = req.params.id;
    feedbackService.getOne(this.mysql, id)
        .then(result => {
            if (!result) {
                res.status(404).send({ error: 'Not Found' });
                return;
            }
            res.send(result);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function createFeedback(req, res) {
    const data = req.body;
    feedbackService.createFeedback(this.mysql, data)
        .then(result => feedbackService.getOne(this.mysql, result.insertId))
        .then(item => res.send(item))
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

function updateFeedback(req, res) {
    const id = req.params.id;
    const data = req.body;

    feedbackService.updateFeedback(this.mysql, data, id)
        .then(async result => {
            if (result.affectedRows === 0) {
                res.status(404).send({ error: 'Not Found' });
                return;
            }
            const item = await feedbackService.getOne(this.mysql, id);
            res.send(item);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal Server Error' });
        });
}

async function deleteFeedback(req, res) {
    const id = req.params.id;
    try {
        const item = await feedbackService.getOne(this.mysql, id);
        if (!item) {
            res.status(404).send({ error: 'Feedback not found' });
            return;
        }
        const result = await feedbackService.deleteFeedback(this.mysql, id);
        if (result.error) {
            res.status(500).send(result);
        } else {
            res.send(item);
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAll,
    getOne,
    createFeedback,
    updateFeedback,
    deleteFeedback,
};
