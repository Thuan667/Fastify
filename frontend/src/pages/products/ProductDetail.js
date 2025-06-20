import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Api } from '../api/Api';
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${Api}/products/${productId}`);
        setProduct(response.data.data.attributes);
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await axios.get(`${Api}/products/${productId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        setErrorReviews('Không thể tải đánh giá sản phẩm.');
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const user_id = user ? user.id : null;

      if (!user_id || !token) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        return;
      }

      await axios.post(`${Api}/carts`, {
        user_id,
        product_id: product.id,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Đã thêm vào giỏ hàng!");
      setAddedToCart(true);
    } catch (error) {
      toast.error("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const user_id = user ? user.id : null;

      if (!user_id || !token) {
        toast.error("Vui lòng đăng nhập để thêm vào yêu thích.");
        return;
      }

      await axios.post(`${Api}/wishlists`, {
        user_id,
        product_id: product.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsFavorite(true);
      toast.success("Đã thêm vào danh sách yêu thích!");
    } catch (error) {
      toast.error("Lỗi khi thêm vào yêu thích!");
    }
  };

  const handleQuantityChange = (e) => setQuantity(e.target.value);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.imageContainer}>
        <img
          src={`http://localhost:3000/public/${product.image}`}
          alt={product.product_name}
          style={styles.image}
        />
      </div>
      <div style={styles.infoContainer}>
        <h2 style={styles.title}>{product.product_name}</h2>
        <p style={styles.price}>{product.price} VND</p>
        {product.sale && <p style={styles.salePrice}>Khuyến mãi: {product.sale_price} VND</p>}
        <p><strong>Mô tả:</strong> {product.description}</p>
        <p><strong>Trạng thái:</strong> {product.status === 1 ? '✅ Còn hàng' : '❌ Hết hàng'}</p>

        <div>
          <label>Số lượng: </label>
          <input 
            type="number" 
            value={quantity} 
            min="1" 
            onChange={handleQuantityChange} 
            style={styles.quantityInput} 
          />
        </div>

        <div style={styles.socialIcons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaFacebookF /></a>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaGoogle /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}><FaTwitter /></a>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.cartButton} onClick={handleAddToCart} disabled={addedToCart}>
            🛒 {addedToCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
          </button>
          <button style={styles.favoriteButton} onClick={handleAddToWishlist}>
            {isFavorite ? '💖 Đã yêu thích' : '🤍 Yêu thích'}
          </button>
        </div>

        {/* Hiển thị đánh giá */}
        <div style={{ marginTop: '40px' }}>
          <h3>Đánh giá sản phẩm</h3>
          {loadingReviews ? (
            <p>Đang tải đánh giá...</p>
          ) : errorReviews ? (
            <p>{errorReviews}</p>
          ) : reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {reviews.map(review => (
                <li key={review.id} style={styles.reviewItem}>
                  <p><strong>{review.username || `Người dùng #${review.user_id}`}</strong> - {Array(review.rating).fill('⭐').join('')}</p>
                  <p>{review.comment}</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>Đánh giá lúc: {new Date(review.created_at).toLocaleString()}</p>
                  {review.admin_reply && (
                    <p style={{ color: 'green', fontStyle: 'italic' }}>
                      Phản hồi từ admin: {review.admin_reply}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '30px',
    gap: '40px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    flex: 1,
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#c0392b',
  },
  price: {
    fontSize: '20px',
    color: '#c0392b',
  },
  salePrice: {
    fontSize: '18px',
    color: '#27ae60',
  },
  quantityInput: {
    width: '60px',
    padding: '5px',
    marginLeft: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  socialIcons: {
    marginTop: '10px',
  },
  icon: {
    fontSize: '20px',
    marginRight: '10px',
    color: '#333',
  },
  buttonGroup: {
    marginTop: '20px',
  },
  cartButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  favoriteButton: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
};

export default ProductDetail;
