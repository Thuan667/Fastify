// src/pages/AdminFeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from "../../api/Api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchFeedbacks = () => {
    axios.get(`${Api}/feedbacks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFeedbacks(res.data))
      .catch(err => {
        console.error('Lỗi khi lấy phản hồi:', err);
        if (err.response?.status === 401) {
          alert('Bạn không có quyền truy cập.');
        }
      });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`${Api}/feedbacks/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          fetchFeedbacks();
          resetForm();
        })
        .catch(err => console.error('Lỗi cập nhật:', err));
    } else {
      axios.post(`${Api}/feedbacks`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          fetchFeedbacks();
          resetForm();
        })
        .catch(err => console.error('Lỗi tạo mới:', err));
    }
  };

  const handleEdit = (fb) => {
    setForm({ name: fb.name, email: fb.email, message: fb.message });
    setIsEditing(true);
    setEditId(fb.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phản hồi này không?')) {
      axios.delete(`${Api}/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => fetchFeedbacks())
        .catch(err => console.error('Lỗi khi xóa:', err));
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', message: '' });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <h2>Danh sách phản hồi</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label>Tên</label>
          <input type="text" className="form-control" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label>Nội dung</label>
          <textarea className="form-control" value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} className="btn btn-secondary ms-2">
            Hủy
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Nội dung</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb.id}>
              <td>{fb.id}</td>
              <td>{fb.name}</td>
              <td>{fb.email}</td>
              <td>{fb.message}</td>
              <td>{new Date(fb.created_at).toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(fb)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(fb.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
