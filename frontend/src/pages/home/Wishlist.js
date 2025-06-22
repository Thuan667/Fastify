import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Api } from './../api/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuickView from './QuickView';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleQuickView = (productId) => {
    setSelectedProductId(productId);
    setShowQuickView(true);
  };

  const getWishlist = (id) => {
    setLoading(true);
    axios
      .get(`${Api}/wishlists/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((result) => {
        setWishlist(result.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getWishlistCount = (id) => {
    axios
      .get(`${Api}/wishlists/count`, {
        params: { user_id: id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res.data && typeof res.data.count === 'number') {
          localStorage.setItem('wishlistCount', res.data.count);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi đếm yêu thích:', err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${Api}/wishlists/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Xóa sản phẩm khỏi yêu thích thành công!');
          getWishlist(userId);
          getWishlistCount(userId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setUserId(user.id);
      getWishlist(user.id);
      getWishlistCount(user.id);
    } else {
      toast.error('Đăng nhập để xem danh mục yêu thích!');
    }
  }, []);

  if (!userId) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <ToastContainer />
        <h3>Vui lòng đăng nhập để xem danh sách yêu thích của bạn.</h3>
      </div>
    );
  }

  return (
    <>
      {/* BREADCRUMB */}
      <div id="breadcrumb" className="section">
        <div className="container">
          <ToastContainer />
          <div className="row">
            <div className="col-md-12">
              <h3 className="breadcrumb-header">Yêu Thích</h3>
              <ul className="breadcrumb-tree">
                <li><Link to="/">Trang Chủ</Link></li>
                <li className="active">Yêu thích</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION */}
      <div className="section">
        <div className="container">
          <div className="row">
            <table id="wishlist" className="table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}></th>
                  <th style={{ width: '25%' }}>Tên sản phẩm</th>
                  <th style={{ width: '20%', textAlign: "center" }}>Giá</th>
                  <th style={{ width: '20%' }}></th>
                  <th style={{ width: '10%' }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className="spinner-container">
                        <Spinner animation="border" />
                      </div>
                    </td>
                  </tr>
                ) : wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={`http://localhost:3000/public/${item.product.image}`}
                          alt={item.product.product_name}
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          }}
                        />
                      </td>
                      <td>
                        <h2 className="product-name">
                          <Link to={`/products/${item.product_id}`}>
                            {item.product.product_name}
                          </Link>
                        </h2>
                      </td>
                      <td style={{ textAlign: "center" }}>{item.product.price} VND</td>
                     <td>
  <button
    onClick={() => handleQuickView(item.product_id)}
    style={{
      backgroundColor: '#e53935',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: '100%',
      transition: '0.3s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = '#c62828')}
    onMouseLeave={(e) => (e.target.style.backgroundColor = '#e53935')}
  >
    🛒 Thêm vào giỏ
  </button>
</td>

                      <td>
                        <div className="delete-wishlist-icon">
                          <i
                            onClick={() => handleDelete(item.id)}
                            className="fa fa-trash"
                            style={{ cursor: 'pointer', color: 'red' }}
                            aria-hidden="true"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <h4>Danh sách yêu thích trống</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <QuickView
          showModal={showQuickView}
          hideQuickView={() => setShowQuickView(false)}
          productId={selectedProductId}
        />
      </div>
    </>
  );
};

export default Wishlist;
