import React, { useState, useEffect } from "react";
import axios from "axios";
import { Api } from "../../api/Api";
import { Modal } from "react-bootstrap";  // Import Modal từ react-bootstrap
import Swal from 'sweetalert2';
import Footer from '../product/Footer';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [orderDetails, setOrderDetails] = useState(null);  // State để lưu chi tiết đơn hàng
  const [showOrderDetails, setShowOrderDetails] = useState(false);  // Trạng thái hiển thị modal chi tiết
  const [orderToEdit, setOrderToEdit] = useState(null);  // State để lưu thông tin đơn hàng khi sửa
  const [showEditModal, setShowEditModal] = useState(false);  // Trạng thái hiển thị modal sửa đơn hàng
const [selectedStatuses, setSelectedStatuses] = useState({});

  // Hàm gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${Api}/orders`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      // Cập nhật danh sách đơn hàng và pagination
      setOrders(response.data.data);
      console.log(response.data);
      setPagination(prevState => ({
        ...prevState,
        total: response.data.meta.pagination.total,
      }));
    } catch (err) {
      setError("Danh sách đơn hàng trống");
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API để lấy chi tiết đơn hàng theo ID
  const fetchOrderDetails = async (id) => {
    try {
      const response = await axios.get(`${Api}/orders/${id}`);
      setOrderDetails(response.data.data);
      setShowOrderDetails(true);  // Hiển thị modal chi tiết đơn hàng
    } catch (err) {
      setError("Có lỗi xảy ra khi lấy chi tiết đơn hàng");
    }
  };

  // Hàm gọi API để sửa đơn hàng
  const handleEditOrder = async (id, updatedOrderData) => {
    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

      await axios.put(`${Api}/orders/${id}`, updatedOrderData,{
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
          },
      }
      );
      fetchOrders();  // Cập nhật lại danh sách đơn hàng
      console.log("Dữ liệu sửa đơn hàng", updatedOrderData); // Kiểm tra dữ liệu
      setShowEditModal(false);  // Đóng modal sửa đơn hàng
      Swal.fire("Thành công", "Đơn hàng đã được sửa thành công", "success");
    } catch (err) {
        Swal.fire("Có lỗi", "Có lỗi xảy ra khi sửa đơn hàng", "error");
      setError("Có lỗi xảy ra khi sửa đơn hàng");
    }
  };

  // Hàm gọi API để xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
  
      await axios.delete(`${Api}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        },
      });
      fetchOrders();  // Cập nhật lại danh sách đơn hàng sau khi xóa
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa đơn hàng");
    }
  };
const handleConfirmOrder = async (userId, orderId) => {
  const newStatus = selectedStatuses[orderId];

  if (!newStatus) {
    alert("Vui lòng chọn trạng thái");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await axios.put(`${Api}/orders/user/${userId}/order/${orderId}/status?status=${newStatus}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    Swal.fire("Thành công", "Đã cập nhật trạng thái đơn hàng", "success");
    fetchOrders(); // reload lại danh sách đơn hàng
  } catch (err) {
    Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
    console.error("Lỗi xác nhận đơn hàng:", err);
  }
};

const handleExportExcel = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${Api}/orders/export-excel`, {
      params: {
        page: pagination.page,
        limit: pagination.limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
      withCredentials: true,
    });

    // Tạo URL từ blob và tải xuống
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // ✅ Thông báo thành công
    Swal.fire({
      icon: "success",
      title: "Xuất Excel thành công!",
      text: "File đã được tải về máy.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Lỗi khi xuất Excel:", err);
    Swal.fire("Lỗi", "Không thể xuất file Excel", "error");
  }
};




  // Gọi API mỗi khi trang hoặc limit thay đổi
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit]);

const handleStatusChange = (orderId, status) => {
  setSelectedStatuses(prev => ({
    ...prev,
    [orderId]: status
  }));
};

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (newPage) => {
    setPagination(prevState => ({
      ...prevState,
      page: newPage,
    }));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  // Phân trang
  const paginationStyle = {
    backgroundColor: '#e60000',  // Màu đỏ sáng
    color: 'white',
    borderRadius: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    margin: '0 5px',
    fontSize: '14px',
  };

  const disabledStyle = {
    backgroundColor: '#d1d1d1',  // Màu xám
    color: '#7e7e7e',
    cursor: 'not-allowed',
    margin: '0 5px',
    fontSize: '14px',
  };

  return (
    <div >
    <div className="container">
      <h1 className="my-4">Danh sách đơn hàng</h1>
 <button className="btn btn-success mb-3" onClick={handleExportExcel}>
  Xuất Excel
</button>
      {/* Hiển thị danh sách đơn hàng */}
    <table className="table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Tên người nhận</th>
      <th>Tổng tiền</th>
      <th>Địa chỉ</th>
      <th>Ngày tạo</th>
      <th>Hành động</th>
      <th>Trạng thái</th> {/* Thêm cột mới ở đây */}
      <th>Tình trạng</th>
       <th>Thanh toán </th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.name}</td>
        <td>{order.total_money}</td>
        <td>{order.address}</td>
        <td>{new Date(order.created_at).toLocaleString()}</td>
        <td>
          <button
            className="btn btn-info"
            onClick={() => fetchOrderDetails(order.id)}
          >
            Chi tiết
          </button>
          {/* <button
            className="btn btn-warning ms-2"
            onClick={() => {
              setOrderToEdit(order);
              setShowEditModal(true);
            }}
          >
            Sửa
          </button> */}
          {/* <button
            className="btn btn-danger ms-2"
            onClick={() => handleDeleteOrder(order.id)}
          >
            Xóa
          </button>
          */}
        </td>
     <td>
  <select
    className="form-select form-select-sm"
    value={selectedStatuses[order.id] || order.order_status.toString()}
    onChange={(e) => handleStatusChange(order.id, e.target.value)}
  >
    <option value="0">Chờ xác nhận</option>
    <option value="1">Đang vận chuyển</option>
    <option value="4">Chờ giao hàng</option>
    <option value="2">Đã huỷ</option>
    <option value="3">Giao hoàn thành</option>
  </select>

  <button
    className="btn btn-success btn-sm mt-2"
    onClick={() => handleConfirmOrder(order.user_id, order.id)}
  >
    Xác nhận
  </button>
</td>
 {/* Cột Tình trạng mới */}
  <td>
  {parseInt(order.order_status) === 0 && (
    <span className="badge bg-warning text-dark">Chờ xác nhận</span>
  )}
  {parseInt(order.order_status) === 1 && (
    <span className="badge bg-info">Đang vận chuyển</span>
  )}
  {parseInt(order.order_status) === 4 && (
    <span className="badge bg-primary">Chờ giao hàng</span>
  )}
  {parseInt(order.order_status) === 3 && (
    <span className="badge bg-success">Giao hoàn thành</span>
  )}
  {parseInt(order.order_status) === 2 && (
    <span className="badge bg-danger">Đã huỷ</span>
  )}
</td>

<td>
  {order.status === 'PAID' ? (
    <span className="badge bg-success">Đã thanh toán</span>
  ) : order.status === 'PENDING' ? (
    <span className="badge bg-secondary">Chưa thanh toán</span>
  ) : !order.status || order.status.trim() === '' ? (
    <span className="badge bg-warning text-dark">Thanh toán tiền mặt</span>
  ) : (
    <span className="badge bg-info">{order.status}</span>
  )}
</td>


      </tr>
    ))}
  </tbody>
</table>


      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal show={showOrderDetails} onHide={() => setShowOrderDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #{orderDetails?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Khách hàng:</strong> {orderDetails?.name}</p>
          <p><strong>Email:</strong> {orderDetails?.email}</p>
          <p><strong>Số điện thoại:</strong> {orderDetails?.phone}</p>
          <p><strong>Địa chỉ:</strong> {orderDetails?.address}</p>
          <p><strong>Quận/Huyện:</strong> {orderDetails?.district}</p>
          <p><strong>Tỉnh/Thành phố:</strong> {orderDetails?.provinces}</p>
          <p><strong>Xã/Phường:</strong> {orderDetails?.wards}</p>
          <p><strong>Ngày tạo:</strong> {new Date(orderDetails?.created_at).toLocaleString()}</p>
          <p><strong>Tổng tiền:</strong> {orderDetails?.total_money}</p>
          <h4>Danh sách sản phẩm:</h4>
          <ul>
            {orderDetails?.products.map(product => (
              <li key={product.product_id}>
                <img src={`http://localhost:3000/public/${product.image}`} alt={product.product_name} width={50} height={50} />
                <span>{product.product_name}</span> - {product.quantity} x {product.price} VND
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowOrderDetails(false)}>
            Đóng
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal sửa đơn hàng */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa đơn hàng #{orderToEdit?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Tên khách hàng:</label>
            <input
              type="text"
              className="form-control"
              value={orderToEdit?.name || ''}
              onChange={(e) => setOrderToEdit({ ...orderToEdit, name: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={orderToEdit?.email || ''}
              onChange={(e) => setOrderToEdit({ ...orderToEdit, email: e.target.value })}
            />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <input
              type="text"
              className="form-control"
              value={orderToEdit?.phone || ''}
              onChange={(e) => setOrderToEdit({ ...orderToEdit, phone: e.target.value })}
            />
          </div>
          <div>
            <label>Địa chỉ:</label>
            <input
              type="text"
              className="form-control"
              value={orderToEdit?.address || ''}
              onChange={(e) => setOrderToEdit({ ...orderToEdit, address: e.target.value })}
            />
          </div>
          <div>
            <label>Quận/Huyện:</label>
            <input           type="text"
          className="form-control"
          value={orderToEdit?.district || ''}
          onChange={(e) => setOrderToEdit({ ...orderToEdit, district: e.target.value })}
        />
      </div>
      <div>
        <label>Tỉnh/Thành phố:</label>
        <input
          type="text"
          className="form-control"
          value={orderToEdit?.provinces || ''}
          onChange={(e) => setOrderToEdit({ ...orderToEdit, provinces: e.target.value })}
        />
      </div>
      <div>
        <label>Xã/Phường:</label>
        <input
          type="text"
          className="form-control"
          value={orderToEdit?.wards || ''}
          onChange={(e) => setOrderToEdit({ ...orderToEdit, wards: e.target.value })}
        />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
        Đóng
      </button>
      <button
        className="btn btn-primary"
        onClick={() => handleEditOrder(orderToEdit.id, orderToEdit)}
      >
        Lưu
      </button>
    </Modal.Footer>
  </Modal>

  {/* Phân trang */}
  <div className="pagination">
    <button
      style={pagination.page === 1 ? disabledStyle : paginationStyle}
      disabled={pagination.page === 1}
      onClick={() => handlePageChange(pagination.page - 1)}
    >
      Trước
    </button>
    <button
      style={pagination.page === Math.ceil(pagination.total / pagination.limit) ? disabledStyle : paginationStyle}
      disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
      onClick={() => handlePageChange(pagination.page + 1)}
    >
      Sau
    </button>
  </div>
</div>

<Footer/></div>
);
};

export default Order;