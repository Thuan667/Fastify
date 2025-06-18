const orderService = require('../services/orders.service');
const ExcelJS = require('exceljs');
// Hàm lấy thông tin sản phẩm từ bảng products
const getProductById = async (db, productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, product_name, image FROM products WHERE id = ?', [productId], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] || null); // Trả về sản phẩm hoặc null nếu không tìm thấy
        });
    });
};

// Hàm lấy tất cả đơn hàng
async function getAllOrders(req, res) {
    const { page = 1, limit = 10, user_id } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = pageNum > 0 ? pageNum : 1;
    const validLimit = limitNum > 0 ? limitNum : 10;

    try {
        const result = await orderService.getAllOrders(this.mysql, validPage, validLimit, user_id);

        if (!result || !result.data || result.data.length === 0) {
            return res.status(404).send({ error: 'No orders found' });
        }

        const formattedResult = {
            data: await Promise.all(result.data.map(async order => {
                let products = [];
                try {
                    // Kiểm tra nếu order.products là chuỗi JSON hợp lệ
                    console.log('Products in order:', order.products);  // Kiểm tra giá trị order.products
                    if (typeof order.products === 'string') {
                        products = JSON.parse(order.products); // Nếu là chuỗi, parse nó
                    } else if (Array.isArray(order.products)) {
                        products = order.products; // Nếu là mảng, sử dụng trực tiếp
                    }
                } catch (e) {
                    console.error('Error parsing products:', e);
                }

                // Đảm bảo rằng products là một mảng hợp lệ
                if (!Array.isArray(products)) {
                    products = [];
                }

                // Lấy thông tin sản phẩm từ bảng products
                const productInfos = await Promise.all(
                    products.map(async p => {
                        const productInfo = await getProductById(this.mysql, p.product_id);
                        console.log(`Product info for ${p.product_id}:`, productInfo);  // Kiểm tra sản phẩm đã lấy được thông tin
                        return {
                            product_id: p.product_id,
                            quantity: p.quantity,
                            price: p.price,
                            product_name: productInfo ? productInfo.product_name : null,
                            image: productInfo ? productInfo.image : null
                        };
                    })
                );

                return {
                    id: order.id.toString(),
                    user_id: order.user_id,
                    total_money: order.total_money,
                    address: order.address,
                    district: order.district,
                    email: order.email,
                    name: order.name,
                    phone: order.phone,
                    provinces: order.provinces,
                    wards: order.wards,
                    products: productInfos, // Đảm bảo rằng products chứa đầy đủ thông tin
                    created_at: order.created_at,
                    updated_at: order.updated_at,
                    order_status:order.order_status,
                    status:order.status,

                };
            })),
            meta: result.meta
        };

        res.send(formattedResult);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}






async function getOrder(req, res) {
    const { id } = req.params;

    try {
        const result = await orderService.getOrderById(this.mysql, id);

        if (!result || !result.data) {
            return res.status(404).send({ error: 'Order not found' });
        }

        let products = [];
        try {
            if (typeof result.data.products === 'string') {
                products = JSON.parse(result.data.products);
            } else if (Array.isArray(result.data.products)) {
                products = result.data.products;
            }
        } catch (e) {
            console.error('Error parsing products:', e);
        }

        if (!Array.isArray(products)) {
            products = [];
        }

        const productInfos = await Promise.all(
            products.map(async p => {
                const productInfo = await getProductById(this.mysql, p.product_id);
                return {
                    product_id: p.product_id,
                    quantity: p.quantity,
                    price: p.price,
                    product_name: productInfo ? productInfo.product_name : null,
                    image: productInfo ? productInfo.image : null
                };
            })
        );

        const formattedResult = {
            data: {
                id: result.data.id.toString(),
                user_id: result.data.user_id,
                total_money: result.data.total_money,
                address: result.data.address,
                district: result.data.district,
                email: result.data.email,
                name: result.data.name,
                phone: result.data.phone,
                provinces: result.data.provinces,
                wards: result.data.wards,
                products: productInfos,
                created_at: result.data.created_at,
                updated_at: result.data.updated_at
            },
            meta: result.meta || {
                pagination: {
                    page: 1,
                    pageSize: 1,
                    pageCount: 1,
                    total: 1
                }
            }
        };

        res.send(formattedResult);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}




async function getOrdersByUserId(req, res) {
    const { user_id } = req.params;

    try {
        const result = await orderService.getOrdersByUserId(this.mysql, user_id);

        if (!result || !result.data.length) {
            return res.status(404).send({ error: 'No orders found for this user' });
        }

        const formattedResult = {
            data: await Promise.all(result.data.map(async (order) => {
                let products = [];
                try {
                    if (typeof order.products === 'string') {
                        products = JSON.parse(order.products);
                    } else if (Array.isArray(order.products)) {
                        products = order.products;
                    }
                } catch (e) {
                    console.error('Error parsing products:', e);
                }

                if (!Array.isArray(products)) {
                    products = [];
                }

                const productDetails = await Promise.all(products.map(async (p) => {
                    const productInfo = await getProductById(this.mysql, p.product_id);
                    return {
                        product_id: p.product_id,
                        quantity: p.quantity,
                        price: p.price,
                        product_name: productInfo?.product_name || null,
                        image: productInfo?.image || null
                    };
                }));

                return {
                    id: order.id.toString(),
                    user_id: order.user_id,
                    total_money: order.total_money,
                    address: order.address,
                    district: order.district,
                    email: order.email,
                    name: order.name,
                    phone: order.phone,
                    provinces: order.provinces,
                    wards: order.wards,
                    products: productDetails,
                    created_at: order.created_at,
                    updated_at: order.updated_at
                };
            })),
            meta: result.meta || {
                pagination: {
                    page: 1,
                    pageSize: result.data.length,
                    pageCount: 1,
                    total: result.data.length
                }
            }
        };

        res.send(formattedResult);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}



async function createOrder(req, res) {
    if (!req.body) {
        console.error('No data provided');
        return res.status(400).send({ error: 'No data provided' });
    }

    const data = req.body;
    
    try {
        const result = await orderService.createOrder(this.mysql, data);
        const id = result.insertId;
        const item = await orderService.getOrderById(this.mysql, id);

        let product = [];
        try {
            product = JSON.parse(item.data.products);
        } catch (e) {
            console.error('Error parsing products:', e);
        }

        if (!Array.isArray(product)) {
            product = [];
        }

        // Lấy thông tin sản phẩm từ cơ sở dữ liệu (hoặc từ nơi bạn lưu trữ)
        const productId = product[0]?.product_id;  // Lấy product_id từ mảng sản phẩm (nếu có)
        const productInfo = await getProductById(this.mysql, productId); // Hàm lấy thông tin sản phẩm

        // Định dạng lại dữ liệu trả về
        const formatted = {
            data: {
                ...item.data,
                product: product.map(p => {
                    const productInfoDetails = productInfo || {};
                    return {
                        product_id: p.product_id,
                        quantity: p.quantity,
                        price: p.price,
                        product_name: productInfoDetails.product_name || null,
                        image: productInfoDetails.image || null
                    };
                })
            },
            meta: item.meta
        };

        res.send(formatted);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}


async function updateOrder(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({ error: 'No data provided for update' });
    }

    // Kiểm tra xem ID của đơn hàng có hợp lệ không
    if (isNaN(id)) {
        return res.status(400).send({ error: 'Invalid order ID' });
    }

    try {
        // Lấy thông tin đơn hàng hiện tại từ cơ sở dữ liệu
        const currentOrder = await orderService.getOrderById(this.mysql, id);

        if (!currentOrder || !currentOrder.data) {
            return res.status(404).send({ error: 'Order not found' });
        }

        // Cập nhật các thông tin của đơn hàng
        const updatedOrderData = {
            ...currentOrder.data,  // Giữ nguyên các thông tin cũ
            ...data,  // Cập nhật các trường dữ liệu mới từ request
        };

        // Cập nhật đơn hàng trong cơ sở dữ liệu
        const result = await orderService.updateOrder(this.mysql, id, updatedOrderData);

        // Lấy lại thông tin đơn hàng sau khi cập nhật
        const updatedOrder = await orderService.getOrderById(this.mysql, id);

        let products = [];
        try {
            if (typeof updatedOrder.data.products === 'string') {
                products = JSON.parse(updatedOrder.data.products);
            } else if (Array.isArray(updatedOrder.data.products)) {
                products = updatedOrder.data.products;
            }
        } catch (e) {
            console.error('Error parsing products:', e);
        }

        if (!Array.isArray(products)) {
            products = [];
        }

        const productInfos = await Promise.all(
            products.map(async (p) => {
                const productInfo = await getProductById(this.mysql, p.product_id);
                return {
                    product_id: p.product_id,
                    quantity: p.quantity,
                    price: p.price,
                    product_name: productInfo ? productInfo.product_name : null,
                    image: productInfo ? productInfo.image : null
                };
            })
        );

        const formattedResult = {
            data: {
                id: updatedOrder.data.id.toString(),
                user_id: updatedOrder.data.user_id,
                total_money: updatedOrder.data.total_money,
                address: updatedOrder.data.address,
                district: updatedOrder.data.district,
                email: updatedOrder.data.email,
                name: updatedOrder.data.name,
                phone: updatedOrder.data.phone,
                provinces: updatedOrder.data.provinces,
                wards: updatedOrder.data.wards,
                products: productInfos,  // Đảm bảo rằng products đã được cập nhật với thông tin đầy đủ
                created_at: updatedOrder.data.created_at,
                updated_at: updatedOrder.data.updated_at
            },
            meta: updatedOrder.meta || {}
        };

        res.send(formattedResult);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Internal server error' });
    }
}






function deleteOrder(req, res) {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).send({ error: "Invalid order ID" });
    }

    orderService.deleteOrder(this.mysql, id)
        .then(() => {
            console.log(`Order with id ${id} has been deleted`);
            res.send({ message: 'Order deleted successfully' });
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
}
const getOrdersByUserIdAndStatus = async function (req, res) {
  const { user_id } = req.params;
  const { status } = req.query;

  try {
    const result = await orderService.getOrdersByUserIdAndStatus(this.mysql, user_id, status);

    if (!result || !result.data.length) {
      return res.status(404).send({ error: 'No orders found for this user with specified status' });
    }

    const formattedResult = {
      data: await Promise.all(result.data.map(async (order) => {
        let products = [];
        try {
          if (typeof order.products === 'string') {
            products = JSON.parse(order.products);
          } else if (Array.isArray(order.products)) {
            products = order.products;
          }
        } catch (e) {
          console.error('Error parsing products:', e);
        }

        if (!Array.isArray(products)) {
          products = [];
        }

        const productDetails = await Promise.all(products.map(async (p) => {
          const productInfo = await getProductById(this.mysql, p.product_id);
          return {
            product_id: p.product_id,
            quantity: p.quantity,
            price: p.price,
            product_name: productInfo?.product_name || null,
            image: productInfo?.image || null
          };
        }));

        return {
          id: order.id.toString(),
          user_id: order.user_id,
          total_money: order.total_money,
          address: order.address,
          district: order.district,
          email: order.email,
          name: order.name,
          phone: order.phone,
          provinces: order.provinces,
          wards: order.wards,
          products: productDetails,
          created_at: order.created_at,
          updated_at: order.updated_at
        };
      })),
      meta: result.meta || {
        pagination: {
          page: 1,
          pageSize: result.data.length,
          pageCount: 1,
          total: result.data.length
        }
      }
    };

    res.send(formattedResult);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
};



const updateOrderStatusById = async function (req, res) {
  const { user_id, id } = req.params;
  const { status } = req.query;

  try {
    const result = await orderService.updateOrderStatusById(this.mysql, user_id, id, status);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Order not found or not updated' });
    }

    return res.send({ updatedCount: result.affectedRows, message: `Updated ${result.affectedRows} order(s) to status = ${status}` });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Handler để xuất Excel
async function exportOrdersExcelHandler(request, reply) {
  const { page = 1, limit = 100, user_id } = request.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const validPage = pageNum > 0 ? pageNum : 1;
  const validLimit = limitNum > 0 ? limitNum : 100;

  try {
    const db = request.server.mysql;
    const result = await orderService.getAllOrders(db, validPage, validLimit, user_id);

    if (!result || !result.data || result.data.length === 0) {
      return reply.code(404).send({ error: 'No orders found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User ID', key: 'user_id', width: 10 },
      { header: 'Total Money', key: 'total_money', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Updated At', key: 'updated_at', width: 20 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'District', key: 'district', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Provinces', key: 'provinces', width: 20 },
      { header: 'Wards', key: 'wards', width: 20 },
      { header: 'Products', key: 'products', width: 40, style: { alignment: { wrapText: true } } },
      { header: 'Order Status', key: 'order_status', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    result.data.forEach(order => {
      const productNames = order.products.map(p => p.product_name || 'Unknown').join(', ');
      worksheet.addRow({
        ...order,
        products: productNames
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    reply
      .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .header('Content-Disposition', 'attachment; filename=orders.xlsx')
      .send(buffer);

  } catch (err) {
    console.error('Export Excel error:', err);
    if (!reply.sent) {
      return reply.code(500).send({ message: 'Lỗi khi xuất Excel' });
    }
  }
}


module.exports = {
    getAllOrders,
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrdersByUserId,
   getOrdersByUserIdAndStatus,
    updateOrderStatusById,
    exportOrdersExcelHandler
};
