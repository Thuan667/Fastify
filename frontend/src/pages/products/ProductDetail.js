import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Api } from '../api/Api';
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
    const [reviews, setReviews] = useState([]); // <-- thêm state lưu reviews
 const [loadingReviews, setLoadingReviews] = useState(true); // riêng cho reviews
  const [errorReviews, setErrorReviews] = useState(null);  // lỗi khi load reviews
  // State mới cho đánh giá mới
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

    // Hàm gửi đánh giá mới
  const handleSubmitReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const user_id = user ? user.id : null;

      if (!user_id || !token) {
        toast.error("Vui lòng đăng nhập để đánh giá sản phẩm.");
        return;
      }

      if (!newComment.trim()) {
        toast.error("Vui lòng nhập nhận xét.");
        return;
      }

      setSubmittingReview(true);

      await axios.post(`${Api}/products/${productId}/reviews`, {
        user_id,
        rating: newRating,
        comment: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Đánh giá của bạn đã được gửi!");

      // Reset form
      setNewRating(5);
      setNewComment('');

      // Tải lại danh sách đánh giá
      const response = await axios.get(`${Api}/products/${productId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      toast.error("Lỗi khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmittingReview(false);
    }
  };
// Lấy đánh giá sản phẩm
useEffect(() => {
  const fetchReviews = async () => {
    console.log('Bắt đầu gọi API lấy đánh giá cho productId:', productId);
    setLoadingReviews(true);
    try {
      const response = await axios.get(`${Api}/products/${productId}/reviews`);
      console.log('API đánh giá trả về:', response.data);
      setReviews(response.data); // backend trả về danh sách đánh giá
    } catch (err) {
      console.error('Lỗi khi lấy đánh giá sản phẩm:', err);
      setErrorReviews('Không thể tải đánh giá sản phẩm.');
    } finally {
      setLoadingReviews(false);
      console.log('Kết thúc gọi API lấy đánh giá');
    }
  };

  fetchReviews();
}, [productId]);


// Lấy thông tin sản phẩm
useEffect(() => {
  const fetchProduct = async () => {
    console.log('Bắt đầu gọi API lấy thông tin sản phẩm productId:', productId);
    try {
      const response = await axios.get(`${Api}/products/${productId}`);
      console.log('API sản phẩm trả về:', response.data);
      setProduct(response.data.data.attributes);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
      setError('Không thể tải dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
      console.log('Kết thúc gọi API lấy thông tin sản phẩm');
    }
  };

  fetchProduct();
}, [productId]);

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const user_id = user ? user.id : null;

      if (!user_id || !token) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        return;
      }

      const product_id = product ? product.id : null;
      if (!product_id) {
        toast.error("Không có sản phẩm để thêm vào giỏ hàng!");
        return;
      }

      // Thêm sản phẩm vào giỏ hàng
      await axios.post(`${Api}/carts`, {
        user_id,
        product_id,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      setAddedToCart(true);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  // Hàm thêm vào yêu thích
  const handleAddToWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const user_id = user ? user.id : null;

      if (!user_id || !token) {
        toast.error("Vui lòng đăng nhập để thêm vào yêu thích.");
        return;
      }

      const product_id = product ? product.id : null;
      if (!product_id) {
        toast.error("Không có sản phẩm để thêm vào yêu thích!");
        return;
      }

      // Thêm sản phẩm vào danh sách yêu thích
      await axios.post(`${Api}/wishlists`, {
        user_id,
        product_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsFavorite(true);
      toast.success("Sản phẩm đã được thêm vào danh sách yêu thích!");
    } catch (error) {
      console.error("Lỗi khi thêm vào yêu thích:", error);
      toast.error("Đã có lỗi khi thêm sản phẩm vào yêu thích!");
    }
  };

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

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
        {product.sale && (
          <p style={styles.salePrice}>Khuyến mãi: {product.sale_price} VND</p>
        )}
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
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FaFacebookF />
          </a>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FaGoogle />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            <FaTwitter />
          </a>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.cartButton} onClick={handleAddToCart} disabled={addedToCart}>
            🛒 {addedToCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
          </button>
          <button
            style={styles.favoriteButton}
            onClick={handleAddToWishlist}
          >
            {isFavorite ? '💖 Đã yêu thích' : '🤍 Yêu thích'}
          </button>
        </div>

          {/* Phần nhập đánh giá mới */}
        <div style={{ marginTop: 40, padding: '15px', border: '1px solid #ccc', borderRadius: 8 }}>
          <h3>Viết đánh giá của bạn</h3>
          <div style={{ marginBottom: 10 }}>
            <label>Đánh giá: </label>
            <select 
              value={newRating} 
              onChange={(e) => setNewRating(Number(e.target.value))}
              style={{ marginLeft: 10, padding: 5 }}
              disabled={submittingReview}
            >
              {[5,4,3,2,1].map(star => (
                <option key={star} value={star}>{star} ⭐</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Nhận xét:</label><br />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8 }}
              disabled={submittingReview}
            />
          </div>
          <button 
            onClick={handleSubmitReview} 
            disabled={submittingReview}
            style={{ ...styles.cartButton, backgroundColor: '#2980b9' }}
          >
            {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>

       {/* Hiển thị phần đánh giá */}
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
          <p>
            <strong>{review.username || `Người dùng #${review.user_id}`}</strong> - Đánh giá: {review.rating} ⭐
          </p>
          <p>{review.comment}</p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Đánh giá lúc: {new Date(review.created_at).toLocaleString()}
          </p>
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

// CSS-in-JS styles
const styles = {
    reviewItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  adminReply: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#dff0d8',
    borderRadius: '6px',
    fontStyle: 'italic',
    color: '#3c763d',
  },
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
};

export default ProductDetail;
