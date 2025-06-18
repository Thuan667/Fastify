import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Footer from './product/Footer';
import Header from '../admin/product/Header';
import { Pie } from '@ant-design/plots';

const Dashboard = () => {
  const data = [
    { type: 'Sản phẩm', value: 22 },
    { type: 'Đơn hàng', value: 52 },
    { type: 'Khách hàng', value: 61 },
    { type: 'Doanh thu', value: 145 },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
        content: '{name} ({percentage})',
        layout: [
          { type: 'pie-spider' },
        ],
      },
      
    interactions: [{ type: 'element-active' }],
    color: ['#dc3545', '#f56c6c', '#ff7875', '#ff4d4f'], // tông đỏ
  };

  return (
    <>
     
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '3rem', color: '#dc3545' }}>TRANG QUẢN LÝ</h1>
          <p className="text-muted">Tổng quan hoạt động</p>
        </div>

        <div className="row mb-5">
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Sản phẩm</h5>
                <p className="card-text fs-4">22</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Đơn hàng</h5>
                <p className="card-text fs-4">1</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Khách hàng</h5>
                <p className="card-text fs-4">2</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Doanh thu</h5>
                <p className="card-text fs-4">0 triệu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body">
            <h5 className="card-title mb-4 text-danger">Biểu đồ thống kê</h5>
            <Pie {...config} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
