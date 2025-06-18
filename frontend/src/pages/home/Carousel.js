import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuickView from './../home/QuickView';
import { Api } from './../api/Api';

const Carousel = ({ title, id }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    getCategories();
    getLatestProducts();
  }, []);

  const getCategories = () => {
    axios
      .get(`${Api}/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.log(error));
  };

  const getLatestProducts = () => {
    setLoading(true);
    axios
      .get(`${Api}/products/latest`)
      .then(response => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleQuickView = (productId) => {
    setSelectedProductId(productId);
    setShowQuickView(true);
  };

  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    infinite: false,
    dots: false,
    arrows: true,
    rows: 1,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="section">
        <ToastContainer />
        <div className="container">
          <div className="col-md-12">
            <div className="section-title">
              <h3 className="title">{title}</h3>
            </div>
          </div>

          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="row-lg-12">
              <div className="col">
                <div className="products-tabs">
                  <div className="tab-pane active">
                    <div className="products-slick" data-nav={`#slick-nav-${id}`}>
                      <Slider {...settings}>
                        {products.map(product => {
                          const attr = product.attributes;
                          return (
                            <div key={product.id} className="product">
                              <div className="product-img">
                                <img
                                  src={`http://localhost:3000/public/${attr.image}`}
                                  alt={attr.product_name || 'Unnamed Product'}
                                />
                                <div className="product-label">
                                  {attr.sale && (
                                    <span className="sale">
                                      -{Math.round(((attr.price - attr.sale_price) / attr.price) * 100)}%
                                    </span>
                                  )}
                                  {new Date(attr.created_at).toDateString() === new Date().toDateString() && (
                                    <span className="new">NEW</span>
                                  )}
                                </div>
                              </div>
                              <div className="product-body">
                                <p className="product-category">{attr.product_category}</p>
                                <h3 className="product-name">
                                  <a href="#">{attr.product_name}</a>
                                </h3>
                                {attr.sale ? (
                                  <h4 className="product-price">
                                    {attr.sale_price}VND
                                    <del className="product-old-price">{attr.price}VND</del>
                                  </h4>
                                ) : (
                                  <h4 className="product-price">{attr.price} VND</h4>
                                )}
                                <div className="product-rating">
                                  {[...Array(5)].map((_, index) => (
                                    <i key={index} className="fa fa-star-o"></i>
                                  ))}
                                </div>
                                <div className="product-btns">
                                  <button className="add-to-compare">
                                    <i className="fa fa-exchange"></i>
                                    <span className="tooltipp">Thêm vào so sánh</span>
                                  </button>
                                  <Button
                                    className="quick-view"
                                    onClick={() => handleQuickView(product.id)}
                                    bsPrefix="q"
                                  >
                                    <i className="fa fa-eye"></i>
                                    <span className="tooltipp">Xem nhanh</span>
                                  </Button>
                                </div>
                              </div>
                              <div className="add-to-cart">
                                <button
                                  className="add-to-cart-btn"
                                  onClick={() => handleQuickView(product.id)}
                                >
                                  <i className="fa fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </Slider>
                    </div>
                    <div id={`slick-nav-${id}`} className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QuickView modal */}
      <QuickView
        showModal={showQuickView}
        hideQuickView={() => setShowQuickView(false)}
        productId={selectedProductId}
      />
    </div>
  );
};

export default Carousel;
