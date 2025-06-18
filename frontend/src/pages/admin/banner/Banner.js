import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api } from "../../api/Api";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({ title: '', image: '', status: 1 });
  const [editingBanner, setEditingBanner] = useState(null);
  const token = localStorage.getItem("token");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${Api}/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanners(res.data); 
    } catch (err) {
      console.error('Lỗi lấy banner:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setEditingImagePreview(`http://localhost:3000/public/${banner.image}`);
    setEditingImageFile(null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditingImageFile(file);
    setEditingImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${Api}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.filename;
    } catch (err) {
      console.error("Upload failed:", err);
      throw new Error("Không thể upload hình ảnh.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = async () => {
    try {
      let filename = "";
      if (imageFile) {
        filename = await uploadImage(imageFile);
      }

      const bannerToAdd = { ...newBanner, image: filename };
      await axios.post(`${Api}/banners`, bannerToAdd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewBanner({ title: '', image: '', status: 1 });
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
      window.location.reload();
    } catch (err) {
      console.error('Lỗi thêm banner:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      let filename = editingBanner.image;
      if (editingImageFile) {
        filename = await uploadImage(editingImageFile);
      }

      const updatedBanner = { ...editingBanner, image: filename };
      await axios.put(`${Api}/banners/${editingBanner.id}`, updatedBanner, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingBanner(null);
      setEditingImageFile(null);
      setEditingImagePreview(null);
      fetchBanners();
    } catch (err) {
      console.error('Lỗi cập nhật banner:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa banner này không?')) {
      try {
        await axios.delete(`${Api}/banners/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBanners();
      } catch (err) {
        console.error('Lỗi xóa banner:', err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-danger mb-4"> Quản lý Banner</h3>

      {/* Form thêm banner */}
      <div className="card shadow-sm mb-4">
        <div className="card-header  text-white">Thêm Banner Mới</div>
        <div className="card-body d-flex align-items-center flex-wrap">
          <input
            type="text"
            className="form-control me-2 mb-2"
            style={{ maxWidth: '250px' }}
            placeholder="Tiêu đề"
            value={newBanner.title}
            onChange={(e) =>
              setNewBanner({ ...newBanner, title: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control me-2 mb-2"
            style={{ maxWidth: '250px' }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Xem trước"
              width="100"
              className="rounded shadow-sm me-2 mb-2"
            />
          )}
          <button onClick={handleAdd} className="btn btn-danger btn-sm">
            ➕ Thêm
          </button>
        </div>
      </div>

      {/* Danh sách banner */}
      <table className="table table-hover text-center align-middle">
        <thead className="table-danger">
          <tr>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(banners) &&
            banners.map((banner) => (
              <tr key={banner.id}>
                {/* Ảnh */}
                <td>
                  {editingBanner && editingBanner.id === banner.id ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="form-control mb-2"
                      />
                      {editingImagePreview && (
                        <img
                          src={editingImagePreview}
                          alt="Xem trước"
                          width="100"
                          className="rounded shadow-sm"
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={`http://localhost:3000/public/${banner.image}`}
                      alt={banner.title}
                      width="100"
                      className="rounded shadow-sm"
                    />
                  )}
                </td>

                {/* Tiêu đề */}
                <td>
                  {editingBanner && editingBanner.id === banner.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editingBanner.title}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          title: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="text-danger fw-semibold">
                      {banner.title}
                    </span>
                  )}
                </td>

                {/* Trạng thái */}
                <td>
                  <span
                    className={`badge ${
                      banner.status === 1 ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {banner.status === 1 ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>

                {/* Hành động */}
                <td>
                  {editingBanner && editingBanner.id === banner.id ? (
                    <>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleUpdate}
                      >
                        💾 Lưu
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => {
                          setEditingBanner(null);
                          setEditingImageFile(null);
                          setEditingImagePreview(null);
                        }}
                      >
                        ❌ Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEdit(banner)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleDelete(banner.id)}
                      >
                        🗑️ Xóa
                      </button>
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

export default Banner;
