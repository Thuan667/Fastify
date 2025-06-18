const shoppingCartService = require('../services/shopping_carts.services'); // Giả sử bạn đã tạo một service cho shopping cart

async function getAllCarts(req, res) {
    const { page = '1', limit = '10', user_id } = req.query;
  
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = pageNum > 0 ? pageNum : 1;
    const validLimit = limitNum > 0 ? limitNum : 10;
  
    try {
      const result = await shoppingCartService.getAllCarts(this.mysql, validPage, validLimit, user_id);
  
      if (!result || !result.data || result.data.length === 0) {
        return res.status(404).send({ error: 'No carts found' });
      }
  
      // Format lại đúng theo schema định nghĩa
      const formattedResult = {
        data: result.data.map(cart => ({
          id: cart.id.toString(),
          product_id: cart.attributes.product_id,
          quantity: cart.attributes.quantity,
          user_id: cart.attributes.user_id,
          created_at: cart.attributes.created_at,
          product: {
            product_name: cart.attributes.product_name,
            price: cart.attributes.price,
            image: cart.attributes.image
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
  

  function getCart(req, res) {
    const { id } = req.params;

    shoppingCartService.getCartById(this.mysql, id)
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'Cart not found' });
                return;
            }

            // Kiểm tra kết quả lấy ra từ DB và điều chỉnh cấu trúc trả về
            const status = result.data.status; // giá trị có thể là "active" hoặc một giá trị số
            const statusValue = (status === "active") ? 1 : (status === "inactive" ? 0 : status);
            
            const formattedResult = {
                data: {
                    id: result.data.id,
                    product_id: result.data.product_id,
                    quantity: result.data.quantity,
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
            
            // Trả lại dữ liệu đã định dạng
            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
// lấy giỏ hàng theo userid
function getCarts(req, res) {
    const { user_id } = req.params;  // Lấy user_id từ params (hoặc có thể từ body)

    shoppingCartService.getCartsByUserId(this.mysql, user_id)
        .then((result) => {
            if (!result || !result.data.length) {
                res.status(404).send({ error: 'No carts found for this user' });
                return;
            }

            // Kiểm tra kết quả lấy ra từ DB và điều chỉnh cấu trúc trả về
            const formattedResult = {
                data: result.data.map(cart => ({
                    id: cart.id,
                    product_id: cart.product_id,
                    quantity: cart.quantity,
                    user_id: cart.user_id,
                    created_at: cart.created_at,
                    product: {
                        product_name: cart.product_name,  // Tên sản phẩm
                        price: cart.price,                 // Giá sản phẩm
                        image: cart.image,                 // Hình ảnh sản phẩm
                    },
                })),
                meta: result.meta,
            };

            // Trả lại dữ liệu đã định dạng
            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}


function createCart(req, res) {
    if (!req.body) {
        console.error('No data provided');
        res.status(400).send({ error: 'No data provided' });
        return;
    }
    const data = req.body;
    shoppingCartService.createCart(this.mysql, data)
        .then(result => {
            const id = result.insertId;
            return shoppingCartService.getCartById(this.mysql, id);
        })
        .then(item => {
            console.log('Cart created: ', item);
            res.send(item);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function updateCart(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!data) {
        console.error('No data provided for update');
        res.status(400).send({ error: 'No data provided' });
        return;
    }

    shoppingCartService.updateCart(this.mysql, id, data)
        .then(() => {
            return shoppingCartService.getCartById(this.mysql, id);
        })
        .then(updatedItem => {
            console.log('Cart updated:', updatedItem);
            res.send(updatedItem);
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function deleteCart(req, res) {
    const id = req.params.id;

    // Đảm bảo rằng id hợp lệ (ví dụ kiểm tra số)
    if (isNaN(id)) {
        return res.status(400).send({ error: "Invalid cart ID" });
    }

    shoppingCartService.deleteCart(this.mysql, id)
        .then(() => {
            console.log(`Cart with id ${id} has been deleted`);
            res.send({ message: 'Cart deleted successfully' });
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
async function countCartItems(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).send({ error: 'Missing user_id' });
  }

  try {
    const totalCarts = await shoppingCartService.countCartsByUserId(this.mysql, user_id);
    res.send({ count: totalCarts });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
}



module.exports = {
    getAllCarts,
    createCart,
    getCart,
    updateCart,
    deleteCart,getCarts,
    countCartItems,
};
