import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authentification from "./../pages/auth/Authentification";
import axios from "axios";
import { connect } from "react-redux";
import { Api } from "./../pages/api/Api";
import CartPreview from "./../pages/home/CartPreview";
import ToastMessage from "../pages/home/ToastMessage";
import '../Layouts/css/Header.css';

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("0");
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}&category=${category}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const fetchWishlistCount = async (userId) => {
    if (!userId) {
      setWishlistCount(0);
      return;
    }
    try {
      const response = await axios.get(`${Api}/wishlists/count`, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data && typeof response.data.count === 'number') {
        setWishlistCount(response.data.count);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng wishlist:", error);
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async (userId) => {
    if (!userId) {
      setCartCount(0);
      return;
    }
    try {
      const response = await axios.get(`${Api}/carts/count`, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data && typeof response.data.count === 'number') {
        setCartCount(response.data.count);
        props.updateCartCount?.(response.data.count); // Cập nhật redux nếu cần
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
      setCartCount(0);
    }
  };

  // useEffect(() => {
  //   let intervalId;

  //   if (props.userData && props.userData.id) {
  //     // Gọi lần đầu
  //     fetchWishlistCount(props.userData.id);
  //     fetchCartCount(props.userData.id);

  //     intervalId = setInterval(() => {
  //       fetchWishlistCount(props.userData.id);
  //       fetchCartCount(props.userData.id);
  //     }, 1000);
  //   } else {
  //     setWishlistCount(0);
  //     setCartCount(0);
  //   }

  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [props.userData]);

  // Lấy cartCount từ state local hoặc fallback props (Redux)
  const effectiveCartCount = cartCount || props.cartCount || 0;

  return (
    <header>
      <ToastMessage />
      <div id="top-header" style={{ backgroundColor: "white" }}>
        <div className="container">
          {/* phần trên header không đổi */}
          <ul className="header-links">
            <li>
              <a href="tel:+84 000000000" style={{ color: "black" }}>
                <i className="fa fa-phone" style={{ color: "black" }}></i> 0343513090
              </a>
            </li>
            <li>
              <a href="mailto:Taithuan@gmail.com" style={{ color: "black" }}>
                <i className="fa fa-envelope-o" style={{ color: "black" }}></i> thuan@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/place/309+Đ.+Lê+Đức+Thọ,+Phường+17,+Gò+Vấp,+Hồ+Chí+Minh,+Vietnam"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                <i className="fa fa-map-marker" style={{ color: "black" }}></i>67/24 tang nhon phu
              </a>
            </li>
          </ul>
          <ul className="header-links">
            <li style={{ display: "flex", alignItems: "center" }}>
              <a href="#" style={{ display: "flex", alignItems: "center", marginRight: "10px", color: "black" }}>
                <i className="fa fa-money" style={{ color: "black" }}></i> VND
              </a>
              <Authentification />
            </li>
          </ul>
        </div>
      </div>

      <div id="header" style={{ backgroundColor: "white" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="header-logo">
                <Link to="/">
                  <img src={require("../assets/img/logo-footer.webp")} alt="Logo công ty" />
                </Link>
              </div>
            </div>

            <div className="col-md-6">
              <div className="header-search">
               <form onSubmit={handleSearch} className="custom-search-form">
  <input
    className="custom-search-input"
    placeholder="Tìm kiếm sản phẩm"
    value={searchQuery}
    onChange={handleInputChange}
  />
  <button type="submit" className="custom-search-button">
    Tìm kiếm
  </button>
</form>

              </div>
            </div>

            <div className="col-md-3">
              <div className="header-ctn">
                <div>
                  <Link to="/wishlist" style={{ color: "black" }}>
                    <i className="fa fa-heart" style={{ color: "black" }}>({wishlistCount})</i>
                    <span style={{ color: "black" }}>Yêu thích </span>
                  </Link>
                </div>
                <div className="dropdown">
                  <Link className="dropdown-toggle" to="/shopping-cart" style={{ color: "black" }}>
                    <i className="fa fa-shopping-cart" style={{ color: "black" }}>({effectiveCartCount})</i>
                    <span style={{ color: "black" }}>Giỏ hàng</span>
                  </Link>
                  <CartPreview />
                </div>
                <div className="menu-toggle">
                  <a href="#" style={{ color: "black" }}>
                    <i className="fa fa-bars"></i>
                    <span>Menu</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  cartCount: state.cart_count,
  userData: state.user_data,
});

const mapDispatchToProps = (dispatch) => ({
  updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
