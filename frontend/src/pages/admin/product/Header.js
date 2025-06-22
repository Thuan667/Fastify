import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../../assets/img/logo-footer.webp';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaThLarge,
  FaUsers,
  FaShoppingCart,
  FaImage,
  FaComments,
  FaInfoCircle,
  FaCreditCard,
  FaChartBar,
  FaHome // Thêm biểu tượng Home
} from 'react-icons/fa';

const Header = () => {
  return (
    <div className="d-flex">
      <div className="bg-dark text-white p-1 w-100">
        <div className="text-center mb-4">
          <Link to="/">
            <img src={logo} alt="Company Logo" style={{ maxWidth: '100%' }} />
          </Link>
        </div>
        <ul className="nav justify-content-start">
          {/* Nút về trang chủ */}
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin">
              <FaHome className="me-2" />Trang Chủ
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/product">
              <FaBoxOpen className="me-2" /> Quản Lý Sản Phẩm
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/category">
              <FaThLarge className="me-2" /> Quản Lý Danh Mục
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/users">
              <FaUsers className="me-2" /> Quản Lý Người Dùng
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/oder">
              <FaShoppingCart className="me-2" /> Quản Lý Đơn Hàng
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/banner">
              <FaImage className="me-2" /> Quản Lý Banner
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/feedback">
              <FaComments className="me-2" /> Quản Lý Phản Hồi
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/reviews">
              <FaInfoCircle className="me-2" /> Quản Lý PH Đánh Giá
            </Link>
          </li>
           <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/pots">
              <FaChartBar className="me-2" /> Quản Lý Bài Viết
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/statistics">
              <FaChartBar className="me-2" /> Quản Lý Thống Kê
            </Link>
          </li>
        </ul>
      </div>
      {/* Nội dung chính bên phải */}
      <div className="flex-grow-1 p-3">
        {/* Bạn có thể đặt nội dung trang admin ở đây */}
      </div>
    </div>
  );
};

export default Header;
