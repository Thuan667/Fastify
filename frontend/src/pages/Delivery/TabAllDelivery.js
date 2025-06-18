import { useEffect, useState } from "react";
import "../../Layouts/css/Delivery.css"
import { CiDeliveryTruck } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import numeral from "numeral";
import {Api} from "../api/Api"


const TabAllDelivery = (props) => {
    const { show, handleClose } = props;
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    // Lấy danh sách đơn hàng theo trạng thái
    const getOrders = async (userId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${Api}/orders/user/${userId}/status?status=${status}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setOrders(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi gọi đơn hàng theo user_id:", error);
            setError("Không thể tải dữ liệu đơn hàng.");
        }
    };

    const cancelOrder = async (id) => {
    const isConfirm = await Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể hoàn nguyên điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, hủy nó!",
    });

    if (!isConfirm.isConfirmed) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire("Lỗi", "Không tìm thấy token, vui lòng đăng nhập lại.", "error");
            return;
        }

        // Giải mã token để lấy userId
        const decoded = jwtDecode(token);
        const userId = decoded.id; // Lấy userId từ token đã giải mã

        const status = 2; // Mã trạng thái để đánh dấu đã hủy (status = 2)

        // Thực hiện PUT request
        await axios.put(`${Api}/orders/user/${userId}/order/${id}/status?status=${status}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Cập nhật lại danh sách đơn hàng sau khi hủy
        setOrders((prev) => prev.filter((order) => order.id !== id));
        Swal.fire("Đã hủy!", "Đơn hàng đã được hủy thành công.", "success");
    } catch (error) {
        console.error("Lỗi khi huỷ đơn hàng:", error);
        Swal.fire("Lỗi", "Không thể hủy đơn hàng.", "error");
    }
};


    // Sử dụng useEffect để gọi API khi component được tải
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.id;
                if (userId) {
                    // Lấy đơn hàng theo trạng thái
                    getOrders(userId, 0);  // 0 là trạng thái mặc định để lấy đơn hàng chưa giao
                } else {
                    console.error("Không tìm thấy userId trong token");
                }
            } catch (err) {
                console.error("Lỗi khi giải mã token:", err);
            }
        } else {
            console.error("Không tìm thấy token");
        }
    }, []); // Chạy 1 lần khi component được mount

    return (
        <>
            <div className="font-sans mb-3">
                <div className="bg-gray-100 mt-3">
                    <input type="text" placeholder="Tìm kiếm..." className="form-control" />
                </div>
                <div>
                    {orders.length > 0 ? (
                        orders.map((item, index) => (
                            <div className="bg-white p-4 mt-2" key={item.id}>
                                <div className="d-flex justify-content-between d-inline">
                                    <div className="d-flex flex-row d-block">
                                        <p style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>
                                            Đơn hàng thứ {index + 1}
                                        </p>
                                    </div>
                                    <div>
                                        <CiDeliveryTruck className="text-success" />
                                        <span className="ml-1 me-2 border-right text-success">Giao hàng nhanh |</span>
                                        <span className="text-danger"><b>Tiết kiệm</b></span>
                                    </div>
                                </div>
                                <hr />
                                {item.products.map((product, productIndex) => (
                                    <div className="d-flex flex-row align-items-center" key={productIndex}>
                                        <Link to="/##">
                                            <img
                    src={`http://localhost:3000/public/${product.image}`} 
                                                alt={product.product_name}
                                                style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                            />
                                        </Link>
                                        <div className="align-content-center ms-3">
                                            <b>{product.product_name}</b>
                                            <div>Số lượng: {product.quantity}</div>
                                            <div>Giá: {formatCurrency(product.price)}</div>
                                            <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex flex-row-reverse mb-5">
                                    <span>Thành tiền: <b>{formatCurrency(item.total_money)}</b></span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        Đánh giá trước <span className="text-danger">15-10-2024</span><br />
                                        <span className="text-danger">Nhận 200 Xu khi đánh giá</span>
                                    </div>
                                    <div>
                                        {parseInt(item.order_status) === 2 ? (
                                            <div>Đã hủy</div>
                                        ) : (
                                            <button className="btnHuyDon me-2" onClick={() => cancelOrder(item.id)}>Hủy đơn hàng</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products"><div className="bg-img"></div></div>
                    )}
                </div>
            </div>

            {/* Modal đánh giá giữ nguyên */}
        </>
    );
};

export default TabAllDelivery;
