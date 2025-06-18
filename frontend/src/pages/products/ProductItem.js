import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import QuickView from '../home/QuickView'; // Import QuickView component

const ProductItem = ({ product }) => {
    const [showQuickView, setShowQuickView] = useState(false); // State để điều khiển modal QuickView
    const [selectedProductId, setSelectedProductId] = useState(null); // State để lưu id của sản phẩm
    // Hàm mở QuickView
    const handleQuickView = (productId) => {
        setSelectedProductId(productId); // Lưu id sản phẩm đã chọn
        setShowQuickView(true); // Mở modal
    }

    return (
        <div className="product" style={{ marginBottom: "60px" }}>
            <div className="product-img">
                <img 
                    src={`http://localhost:3000/public/${product.image}`} 
                    alt={product.product_name || 'Unnamed Product'} 
                />
                <div className="product-label">
                    <span className="new">NEW</span>
                </div>
            </div>
            <div className="product-body">
                <p className="product-category">{product.category_name || 'Uncategorized'}</p>
                <h3 className="product-name">
                    <Link to={`/products/${product.id}`}>
                        {product.product_name || 'Unnamed Product'}
                    </Link>
                </h3>
                <h4 className="product-price">{product.price || 'N/A'}VND</h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <div className="product-btns">
                  
                    <button className="add-to-compare">
                        <i className="fa fa-exchange"></i><span className="tooltipp">Thêm vào so sánh</span>
                    </button>
                    <button 
                        className="quick-view"
                        onClick={() => handleQuickView(product.id)} // Mở modal khi nhấn Xem Nhanh
                    >
                        <i className="fa fa-eye"></i><span className="tooltipp">Xem Nhanh</span>
                    </button>
                </div>
            </div>
            <div className="add-to-cart">
                <button className="add-to-cart-btn"
                                        onClick={() => handleQuickView(product.id)} // Mở modal khi nhấn Xem Nhanh
>
                    <i className="fa fa-shopping-cart">
                        </i> Thêm vào giỏ</button>
            </div>

            {/* Hiển thị QuickView khi showQuickView là true */}
            <QuickView 
                showModal={showQuickView} 
                hideQuickView={() => setShowQuickView(false)} 
                productId={selectedProductId} 
            />
        </div>
    );
};

export default ProductItem;
