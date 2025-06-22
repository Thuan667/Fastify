import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from '../../api/Api';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState(null);
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${Api}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      toast.error('Lỗi tải danh sách bài viết!');
    }
  };
const getUserIdFromToken = () => {
  try {
    const decoded = jwtDecode(token);
    return decoded.id; // bạn đang dùng "id" thay vì "user_id"
  } catch (err) {
    return null;
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditingImageFile(file);
    setEditingImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditingImagePreview(`http://localhost:3000/public/${post.image}`);
    setEditingImageFile(null);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${Api}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.filename;
    } catch (err) {
      toast.error('Lỗi upload ảnh!');
      throw err;
    }
  };

  const handleAdd = async () => {
  try {
    let filename = '';
    if (imageFile) {
      filename = await uploadImage(imageFile);
    }

    const postToAdd = {
      ...newPost,
      image: filename,
      user_id: getUserIdFromToken(), // thêm user_id
    };

    await axios.post(`${Api}/posts`, postToAdd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNewPost({ title: '', content: '', image: '' });
    setImageFile(null);
    setImagePreview(null);
    fetchPosts();
  } catch (err) {
    toast.error('Không thể tạo bài viết');
  }
};


  const handleUpdate = async () => {
    try {
      let filename = editingPost.image;
      if (editingImageFile) {
        filename = await uploadImage(editingImageFile);
      }
      const updatedPost = { ...editingPost, image: filename };
      await axios.put(`${Api}/posts/${editingPost.id}`, updatedPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingPost(null);
      setEditingImageFile(null);
      setEditingImagePreview(null);
      fetchPosts();
    } catch (err) {
      toast.error('Không thể cập nhật bài viết');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá bài viết này không?')) {
      try {
        await axios.delete(`${Api}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPosts();
      } catch (err) {
        toast.error('Xoá thất bại');
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="text-danger mb-4">Quản lý Bài Viết</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-header text-white">Thêm Bài Viết Mới</div>
        <div className="card-body d-flex align-items-center flex-wrap">
          <input
            type="text"
            className="form-control me-2 mb-2"
            style={{ maxWidth: '200px' }}
            placeholder="Tiêu đề"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            className="form-control me-2 mb-2"
            style={{ maxWidth: '300px' }}
            placeholder="Nội dung"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control me-2 mb-2"
            style={{ maxWidth: '250px' }}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Xem trước" width="100" className="rounded shadow-sm me-2 mb-2" />
          )}
          <button onClick={handleAdd} className="btn btn-danger btn-sm">➕ Thêm</button>
        </div>
      </div>

      <table className="table table-hover text-center align-middle">
        <thead className="table-danger">
          <tr>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) && posts.map((post) => (
            <tr key={post.id}>
              <td>
                {editingPost && editingPost.id === post.id ? (
                  <>
                    <input type="file" accept="image/*" onChange={handleEditFileChange} className="form-control mb-2" />
                    {editingImagePreview && <img src={editingImagePreview} alt="Xem trước" width="100" className="rounded shadow-sm" />}
                  </>
                ) : (
                  <img src={`http://localhost:3000/public/${post.image}`} alt={post.title} width="100" className="rounded shadow-sm" />
                )}
              </td>
              <td>
                {editingPost && editingPost.id === post.id ? (
                  <input type="text" className="form-control" value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
                ) : (
                  <span className="text-danger fw-semibold">{post.title}</span>
                )}
              </td>
              <td>
                {editingPost && editingPost.id === post.id ? (
                  <textarea className="form-control" value={editingPost.content} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} />
                ) : (
                  <small>{post.content}</small>
                )}
              </td>
              <td>
                {editingPost && editingPost.id === post.id ? (
                  <>
                    <button className="btn btn-danger btn-sm" onClick={handleUpdate}>💾 Lưu</button>
                    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => { setEditingPost(null); setEditingImageFile(null); setEditingImagePreview(null); }}>❌ Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleEdit(post)}>✏️ Sửa</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(post.id)}>🗑️ Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;