import { useEffect, useState } from "react";
import "../../Layouts/css/Delivery.css";
import { CiDeliveryTruck } from "react-icons/ci";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import numeral from "numeral";
import { Api } from "../api/Api";

const TabFinish = ({ show, handleClose }) => {
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => numeral(value).format("0,0") + " ₫";

  const checkIfReviewed = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${Api}/products/${productId}/reviews/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.reviewed;
    } catch (err) {
      console.error("Lỗi kiểm tra đã đánh giá:", err);
      return false;
    }
  };

  const getOrders = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${Api}/orders/user/${userId}/status?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawOrders = response.data.data || [];

      const enrichedOrders = await Promise.all(
        rawOrders.map(async (order) => {
          const products = typeof order.products === "string" ? JSON.parse(order.products) : order.products;

          const updatedProducts = await Promise.all(
            products.map(async (product) => {
              const reviewed = await checkIfReviewed(product.product_id);
              return { ...product, reviewed };
            })
          );

          return { ...order, products: updatedProducts };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Lỗi khi gọi đơn hàng theo user_id:", error);
      setError("Không thể tải dữ liệu đơn hàng.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        if (userId) {
          getOrders(userId, 3);
        } else {
          console.error("Không tìm thấy userId trong token");
        }
      } catch (err) {
        console.error("Lỗi khi giải mã token:", err);
      }
    } else {
      console.error("Không tìm thấy token");
    }
  }, []);

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        Swal.fire("Lỗi", "Vui lòng đăng nhập để đánh giá.", "error");
        return;
      }

      if (!comment.trim()) {
        Swal.fire("Lỗi", "Vui lòng nhập nội dung đánh giá.", "error");
        return;
      }

      const body = {
        user_id: user.id,
        rating,
        comment,
      };

      await axios.post(`${Api}/products/${selectedProduct.product_id}/reviews`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Thành công", "Cảm ơn bạn đã đánh giá!", "success");
      setSelectedProduct(null);
      setComment('');
      setRating(5);
      getOrders(user.id, 3); // Refresh lại để cập nhật trạng thái đã đánh giá
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể gửi đánh giá, hãy thử lại.";
      Swal.fire("Lỗi", msg, "error");
    }
  };

  return (
    <>
      <div className="font-sans mb-3">
        <div className="bg-gray-100 mt-3">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            className="w-full p-2 border border-gray-300 rounded form-control"
          />
        </div>

        <div>
          {orders.length > 0 ? (
            orders.map((item, index) => (
              <div className="bg-white p-4 mt-2" key={`order-${index}`}>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>
                    Đơn hàng thứ {index + 1}
                  </p>
                  <div>
                    <CiDeliveryTruck className="text-success" />
                    <span className="ml-1 me-2 text-success">Giao hàng nhanh |</span>
                    <span className="text-danger font-bold">Tiết kiệm</span>
                  </div>
                </div>
                <hr />

                {item.products.map((product, productIndex) => (
                  <div key={`product-${productIndex}`} className="mb-3 border-bottom pb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://localhost:3000/public/${product.image}`}
                        alt={product.product_name}
                        style={{ width: "70px", height: "70px", marginRight: "10px" }}
                      />
                      <div>
                        <div><b>{product.product_name}</b></div>
                        <div>Số lượng: {product.quantity}</div>
                        <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-2">
                      {product.reviewed ? (
                        <span className="text-success">Đã đánh giá ✅</span>
                      ) : (
                        <Button
                          className="btnDanhgia me-2"
                          onClick={() => {
                            setSelectedProduct(product);
                            handleClose();
                          }}
                        >
                          Đánh Giá
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="d-flex flex-row-reverse">
                  <span>
                    Thành tiền: <b>{formatCurrency(item.total_money)}</b>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <div className="bg-img"></div>
            </div>
          )}
        </div>
      </div>

      {/* Modal đánh giá */}
      <Modal show={selectedProduct !== null} size="lg" onHide={() => setSelectedProduct(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá sản phẩm</Modal.Title>
        </Modal.Header>
        {selectedProduct && (
          <>
            <div className="d-flex flex-row align-items-center container mt-3">
              <img
                src={`http://localhost:3000/public/${selectedProduct.image}`}
                alt={selectedProduct.product_name}
                style={{ width: "80px", height: "80px" }}
              />
              <div className="align-content-center ms-3">
                <b>{selectedProduct.product_name}</b>
                <div className="text-secondary">Sản phẩm đã mua</div>
              </div>
            </div>

            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Đánh giá (sao):</Form.Label>
                  <Form.Select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map(star => (
                      <option key={star} value={star}>{star} ⭐</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nhận xét</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Hãy chia sẻ cảm nhận của bạn..."
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                Trở lại
              </Button>
              <Button variant="primary" onClick={handleSubmitReview}>
                Gửi đánh giá
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default TabFinish;
