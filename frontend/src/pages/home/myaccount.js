import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { Api } from "../api/Api";
import { useNavigate } from "react-router-dom";

const Myaccount = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const user = useSelector((state) => state.user_data);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    address: "",
    phone: "",
    password: "",
  });

  // Load data từ Redux vào form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        namename: user.namename || "",
        address: user.address || "",
        phone: user.phone || "",
        password: "",
        
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    // 👉 Log dữ liệu formData ra console để kiểm tra
    console.log("📦 Dữ liệu gửi đi cập nhật:", formData);

    await axios.put(`${Api}/users/${user.id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire("Thành công", "Thông tin tài khoản đã được cập nhật", "success");

    dispatch({ type: "USER", value: { ...user, ...formData } });
    localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
    navigate("/");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật tài khoản:", error);
    Swal.fire("Lỗi", "Không thể cập nhật thông tin", "error");
  }
};


  return (
    <div className="container py-4">
      <h4 className="text-danger mb-4">Thông tin tài khoản</h4>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Username</label>
          <input
            className="form-control"
            value={formData.name}
            disabled
          />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input
            className="form-control"
            value={formData.email}
            disabled
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Họ tên</label>
          <input
            className="form-control"
            name="name"
            value={formData.namename}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Địa chỉ</label>
          <input
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label>Số điện thoại</label>
          <input
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Mật khẩu mới (nếu muốn đổi)</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>
      <button className="btn btn-danger" onClick={handleUpdate}>
        Cập nhật thông tin
      </button>
    </div>
  );
};

export default Myaccount;
