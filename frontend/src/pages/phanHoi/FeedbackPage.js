// src/pages/FeedbackPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Api } from "../api/Api";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Api}/feedbacks`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Cảm ơn bạn đã phản hồi!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi gửi phản hồi');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gửi phản hồi</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tên</label>
          <input
            type="text"
            className="form-control"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Nội dung phản hồi</label>
          <textarea
            className="form-control"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-danger">Gửi</button>
      </form>
    </div>
  );
};

export default FeedbackPage;
