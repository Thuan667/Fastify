import React from "react";
import { Link } from "react-router-dom";


const CheckoutVnpay = () => {
    return (
        <div className="checkout-container">
            <div className="checkout-box">
                {/* <div className="success-icon">✔</div> */}
                <h2 className="success-message">THANH TOÁN THÀNH CÔNG</h2>
                {/* <p className="order-details">
          Mã đơn: <span className="order-id">#254541</span> - Tổng tiền: <span className="total-amount">1.000</span>
        </p> */}
                <p className="payment-method">Kiểu thanh toán: Online</p>
                <Link to="/">
                    <button className="return-button">Quay về trang chủ</button>
                </Link>
            </div>
        </div>
    );
};

export default CheckoutVnpay;
