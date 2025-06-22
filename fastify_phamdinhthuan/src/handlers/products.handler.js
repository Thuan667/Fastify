const productsService = require('../services/product.service');

function getAll(req, res) {
    const { page = '1', limit = '10', product_category } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = pageNum > 0 ? pageNum : 1;
    const validLimit = limitNum > 0 ? limitNum : 10;

    productsService
        .getAll(this.mysql, validPage, validLimit, product_category) // truyền category nếu có
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'No products found' });
                return;
            }

            const formattedResult = {
                data: result.data.map((product) => ({
                    id: product.id,
                    attributes: {
                        id: result.data.id,
                        product_name: product.product_name,
                        product_category: product.product_category,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        sale: product.sale,
                        sale_price: product.sale_price,
                        slug: product.slug,
                        created_at: product.created_at,
                        status: product.status,
                    },
                })),
                meta: {
                    pagination: result.meta.pagination,
                },
            };

            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}

function getOne(req, res) {
    const { id } = req.params;
    productsService.getOne(this.mysql, id)
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'Product not found' });
                return;
            }
            const formattedResult = {
                data: {
                    attributes: {
                        id: result.data.id,
                        product_name: result.data.product_name,
                        product_category: result.data.product_category,
                        description: result.data.description,
                        price: result.data.price,
                        image: result.data.image,
                        sale: result.data.sale,
                        sale_price: result.data.sale_price,
                        slug: result.data.slug,
                        created_at: result.data.created_at,
                        status: result.data.status
                    }
                },
                meta: result.meta
            };
            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}


function createProduct(req, res){
    if(!req.body){
        console.error('No data provided');
        res.status(400).send({error:'No data provided'});
        return;
    }
    const data = req.body;
    productsService.createProduct(this.mysql, data)
    .then(result => {
    const id = result.insertId;
    return productsService.getOne(this.mysql, id);
    })
    .then(item => {
        console.log('Product created: ', item);
        res.send(item);
    })
    .catch(err=>{
        console.error('Database error:',err);
        res.status(500).send({error:'Internal server error'});
    })
}
function updateProduct(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    if (!data) {
      console.error('No data provided for update');
      res.status(400).send({ error: 'No data provided' });
      return;
    }
  
    productsService.updateProduct(this.mysql, id, data)
      .then(() => {
        return productsService.getOne(this.mysql, id);
      })
      .then(updatedItem => {
        console.log('Product updated:', updatedItem);
        res.send(updatedItem);
      })
      .catch(err => {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
      });
  }
  function deleteProduct(req, res) {
    const id = req.params.id;
    
    // Đảm bảo rằng id hợp lệ (ví dụ kiểm tra số)
    if (isNaN(id)) {
      return res.status(400).send({ error: "ID sản phẩm không hợp lệ" });
    }
  
    productsService.deleteProduct(this.mysql, id)
      .then(() => {
        console.log(`Sản phẩm với id ${id} đã bị xóa`);
        res.send({ message: 'Xóa sản phẩm thành công' });
      })
      .catch(err => {
        console.error('Lỗi cơ sở dữ liệu:', err);
        res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
      });
  }
function searchProducts(req, res) {
  const { name, product_category, min_price, max_price } = req.query;

  productsService
    .searchProductsByName(this.mysql, { name, product_category, min_price, max_price })
    .then((result) => {
      if (!result || !result.data || result.data.length === 0) {
        res.status(404).send({ error: 'Không tìm thấy sản phẩm phù hợp' });
        return;
      }

      const formattedResult = {
        data: result.data.map((product) => ({
          id: product.id,
          product_name: product.product_name,
          description: product.description,
          price: product.price,
          image: product.image,
          sale: product.sale,
          sale_price: product.sale_price,
          slug: product.slug,
          created_at: product.created_at,
          status: product.status
        })),
        meta: result.meta || { pagination: {} }
      };

      res.send(formattedResult);
    })
    .catch((err) => {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Internal server error' });
    });
}

  
  

  function deleteProducttrash(req, res) {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({ error: "ID sản phẩm không hợp lệ" });
  }

  productsService.deleteProducttrash(this.mysql, id)
    .then(() => {
      console.log(`Sản phẩm với id ${id} đã bị đưa vào thùng rác`);
      res.send({ message: 'Đã chuyển sản phẩm vào thùng rác' });
    })
    .catch(err => {
      console.error('Lỗi cơ sở dữ liệu:', err);
      res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    });
}

  
function getTrashedProducts(req, res) {
  const { page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  productsService.getTrashed(this.mysql, pageNum, limitNum)
    .then((result) => {
      if (!result || !result.data) {
        return res.status(404).send({ error: 'Không có sản phẩm trong thùng rác' });
      }

      const formattedResult = {
        data: result.data.map(product => ({
          id: product.id,
          attributes: {
            product_name: product.product_name,
            product_category: product.product_category,
            description: product.description,
            price: product.price,
            image: product.image,
            sale: product.sale,
            sale_price: product.sale_price,
            slug: product.slug,
            deleted_at: product.deleted_at,
            created_at: product.created_at,
          }
        })),
        meta: {
          pagination: result.meta.pagination
        }
      };

      res.send(formattedResult);
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Internal server error' });
    });
}
function restoreProduct(req, res) {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({ error: "ID sản phẩm không hợp lệ" });
  }

  productsService.restoreProduct(this.mysql, id)
    .then(() => {
      console.log(`Sản phẩm với id ${id} đã được khôi phục`);
      res.send({ message: 'Khôi phục sản phẩm thành công' });
    })
    .catch(err => {
      console.error('Lỗi cơ sở dữ liệu:', err);
      res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    });
}
function getLatestProducts(req, res) {
    const { limit = '10', product_category } = req.query;

    const limitNum = parseInt(limit, 10);
    const validLimit = limitNum > 0 ? limitNum : 10;

    productsService.getLatestProducts(this.mysql, validLimit, product_category)
        .then((result) => {
            if (!result || !result.data) {
                res.status(404).send({ error: 'No products found' });
                return;
            }

            const formattedResult = {
                data: result.data.map((product) => ({
                    id: product.id,
                    attributes: {
                        id: product.id,
                        product_name: product.product_name,
                        product_category: product.product_category,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        sale: product.sale,
                        sale_price: product.sale_price,
                        slug: product.slug,
                        created_at: product.created_at,
                        status: product.status,
                    },
                })),
                meta: {
                    pagination: result.meta ? result.meta.pagination : {},
                },
            };

            res.send(formattedResult);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
function getDiscountedProducts(req, res) {
  const { limit = '10', product_category } = req.query;

  const limitNum = parseInt(limit, 10);
  const validLimit = limitNum > 0 ? limitNum : 10;

  productsService.getDiscountedProducts(this.mysql, validLimit, product_category)
    .then((result) => {
      if (!result || !result.data) {
        res.status(404).send({ error: 'No discounted products found' });
        return;
      }

      const formattedResult = {
        data: result.data.map((product) => ({
          id: product.id,
          attributes: {
            id: product.id,
            product_name: product.product_name,
            product_category: product.product_category,
            description: product.description,
            price: product.price,
            image: product.image,
            sale: product.sale,
            sale_price: product.sale_price,
            slug: product.slug,
            created_at: product.created_at,
            // Không có status nếu bạn không muốn hiển thị
          },
        })),
        meta: {
          pagination: result.meta ? result.meta.pagination : {},
        },
      };

      res.send(formattedResult);
    })
    .catch((err) => {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Internal server error' });
    });
}

module.exports ={
    getAll,
    createProduct,
    getOne,
    updateProduct,
    deleteProduct,
    searchProducts,
    deleteProducttrash,
    getTrashedProducts,
    restoreProduct,
    getLatestProducts,
    getDiscountedProducts,
}