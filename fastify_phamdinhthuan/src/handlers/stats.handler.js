async function getStats(req, res) {
  const db = this.mysql;

  // Hàm gói db.query thành Promise
  const query = (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  try {
    const orders = await query('SELECT COUNT(*) AS totalOrders, SUM(total_money) AS totalRevenue FROM orders');
    const users = await query('SELECT COUNT(*) AS totalUsers FROM users');
    const products = await query('SELECT COUNT(*) AS totalProducts FROM products');
    const feedbacks = await query('SELECT COUNT(*) AS totalFeedbacks FROM feedbacks');

    const ordersPerMonth = await query(`
      SELECT MONTH(created_at) AS month, COUNT(*) AS count
      FROM orders
      GROUP BY MONTH(created_at)
      ORDER BY month
    `);

    res.send({
      totalOrders: orders[0].totalOrders,
      totalRevenue: orders[0].totalRevenue || 0,
      totalUsers: users[0].totalUsers,
      totalProducts: products[0].totalProducts,
      totalFeedbacks: feedbacks[0].totalFeedbacks,
      ordersPerMonth
    });
  } catch (err) {
    console.error('Thống kê lỗi:', err);
    res.status(500).send({ error: 'Lỗi máy chủ' });
  }
}

module.exports = { getStats };
