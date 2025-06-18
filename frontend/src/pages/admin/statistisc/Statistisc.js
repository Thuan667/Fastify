import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from '../../api/Api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import Footer from '../product/Footer';

const Statistisc = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${Api}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setStats(res.data))
      .catch(err => console.error('Lỗi khi lấy thống kê:', err));
  }, []);

  if (!stats) return <div className="text-center mt-5">Đang tải thống kê...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📊 Bảng  thống kê</h2>
      <div className="row text-white">
        <div className="col-md-3">
          <div className="bg-primary p-3 rounded shadow-sm">
            <h5>Tổng đơn hàng</h5>
            <p className="fs-4">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-success p-3 rounded shadow-sm">
            <h5>Doanh thu</h5>
            <p className="fs-4">{stats.totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-info p-3 rounded shadow-sm">
            <h5>Người dùng</h5>
            <p className="fs-4">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-warning p-3 rounded shadow-sm">
            <h5>Phản hồi</h5>
            <p className="fs-4">{stats.totalFeedbacks}</p>
          </div>
        </div>
      </div>

      <h4 className="mt-5">📈 Đơn hàng theo tháng</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.ordersPerMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Tháng', position: 'insideBottomRight', offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>
    
    </div>
    
  );
};

export default Statistisc;
