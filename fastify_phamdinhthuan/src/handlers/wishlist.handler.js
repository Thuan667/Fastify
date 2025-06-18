const wishlistService = require('../services/wishlist.service');

async function getAllWishlists(req, res) {
    const { page = '1', limit = '10', user_id } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = pageNum > 0 ? pageNum : 1;
    const validLimit = limitNum > 0 ? limitNum : 10;

    try {
        const result = await wishlistService.getAllWishlists(this.mysql, validPage, validLimit, user_id);

        if (!result || !result.data || result.data.length === 0) {
            return res.status(404).send({ error: 'No wishlists found' });
        }

        const formattedResult = {
            data: result.data.map(item => ({
                id: item.id.toString(),
                product_id: item.attributes.product_id,
                user_id: item.attributes.user_id,
                created_at: item.attributes.created_at,
                product: {
                    product_name: item.attributes.product_name,
                    price: item.attributes.price,
                    image: item.attributes.image
                }
            })),
            meta: result.meta
        };

        res.send(formattedResult);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}

function getWishlist(req, res) {
    const { id } = req.params;

    wishlistService.getWishlistById(this.mysql, id)
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'Wishlist item not found' });
                return;
            }

            const formattedResult = {
                data: {
                    id: result.data.id,
                    product_id: result.data.product_id,
                    user_id: result.data.user_id,
                    created_at: result.data.created_at,
                    product: {
                        product_name: result.data.product_name,
                        price: result.data.price,
                        image: result.data.image,
                    },
                },
                meta: result.meta,
            };

            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function getWishlists(req, res) {
    const { user_id } = req.params;

    wishlistService.getWishlistsByUserId(this.mysql, user_id)
        .then((result) => {
            if (!result || !result.data.length) {
                res.status(404).send({ error: 'No wishlists found for this user' });
                return;
            }

            const formattedResult = {
                data: result.data.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    user_id: item.user_id,
                    created_at: item.created_at,
                    product: {
                        product_name: item.product_name,
                        price: item.price,
                        image: item.image,
                    },
                })),
                meta: result.meta,
            };

            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function createWishlist(req, res) {
    if (!req.body) {
        console.error('No data provided');
        res.status(400).send({ error: 'No data provided' });
        return;
    }

    const data = req.body;

    wishlistService.createWishlist(this.mysql, data)
        .then(result => {
            const id = result.insertId;
            return wishlistService.getWishlistById(this.mysql, id);
        })
        .then(item => {
            console.log('Wishlist item created: ', item);
            res.send(item);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Đã có sản phẩm trong yêu thích' });
        });
}

function updateWishlist(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!data) {
        console.error('No data provided for update');
        res.status(400).send({ error: 'No data provided' });
        return;
    }

    wishlistService.updateWishlist(this.mysql, id, data)
        .then(() => wishlistService.getWishlistById(this.mysql, id))
        .then(updatedItem => {
            console.log('Wishlist item updated:', updatedItem);
            res.send(updatedItem);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function deleteWishlist(req, res) {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).send({ error: "Invalid wishlist ID" });
    }

    wishlistService.deleteWishlist(this.mysql, id)
        .then(() => {
            console.log(`Wishlist item with id ${id} has been deleted`);
            res.send({ message: 'Wishlist item deleted successfully' });
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
async function countWishlistItems(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).send({ error: 'Missing user_id' });
  }

  try {
    const totalWishlists = await wishlistService.countWishlistsByUserId(this.mysql, user_id);
    res.send({ count: totalWishlists });
  } catch (err) {
    console.error('Wishlist DB error:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
}
module.exports = {
    getAllWishlists,
    getWishlist,
    getWishlists,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    countWishlistItems,
};
