import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Api } from './../api/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuickView from './QuickView';

const Wishlist = ({ user, updateWishlistCount }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
const [showQuickView, setShowQuickView] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);

const handleQuickView = (productId) => {
    setSelectedProductId(productId);
    setShowQuickView(true);
};

    const getWishlist = () => {
        setLoading(true);
        axios.get(`${Api}/wishlists/user/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(result => {
            setWishlist(result.data.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    };

    const getWishlistCount = (userId) => {
        axios.get(`${Api}/wishlists/count`, {
            params: { user_id: userId },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            if (res.data && typeof res.data.count === 'number') {
                updateWishlistCount(res.data.count);
                localStorage.setItem('wishlistCount', res.data.count);
            }
        }).catch(err => {
            console.error('Error fetching wishlist count:', err);
        });
    };

    const handleDelete = (id) => {
        axios.delete(`${Api}/wishlists/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            if (response.status === 200) {
                toast.success('Xóa sản phẩm khỏi yêu thích thành công!');
                getWishlist();
                getWishlistCount(user.id);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getWishlist();
            getWishlistCount(user.id);
        } else {
            toast.error('Đăng nhập để xem danh mục yêu thích!');
        }
    }, [user.id]);

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
                                <li><a href="#">Trang Chủ</a></li>
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
                        <table id="wishlist">
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
                                {localStorage.getItem('token') ? (
                                    loading ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="spinner-container"><Spinner animation="border" /></div>
                                            </td>
                                        </tr>
                                    ) : wishlist.length > 0 ? (
                                        wishlist.map(item => (
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
                                                <td style={{ textAlign: "center" }}>${item.product.price}</td>
                                                <td className="product-column">
                                                    <div className="add-to-cart">
                                                      <button
  className="add-to-cart-btn"
  onClick={() => handleQuickView(item.product_id)}
>
  Thêm Giỏ Hàng
</button>

                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="delete-wishlist-icon">
                                                        <i
                                                            onClick={() => handleDelete(item.id)}
                                                            className="fa fa-trash"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className='py-5'>
                                                <h3>Danh sách yêu thích trống</h3>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="6" className='py-5'>
                                            <h3>Vui lòng đăng nhập để có thể thêm hoặc xem sản phẩm trong danh sách yêu thích của bạn</h3>
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

const mapStateToProps = state => ({
    user: state.user_data
});

const mapDispatchToProps = dispatch => ({
    showLogin: () => dispatch({ type: 'LOGIN_CONTROL', value: true }),
    showQuickView: (id) => dispatch({ type: 'QUICKVIEW_CONTROL', value: id }),
    updateWishlistCount: (count) => dispatch({ type: 'WISHLIST_COUNT', value: count })
});

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
