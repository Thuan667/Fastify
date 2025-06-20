import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";
import Footer from '../product/Footer';

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editModalShow, setEditModalShow] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${Api}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleCreateCategory = async () => {
        try {
            const payload = {
                category_name: name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                parent: 0,
                status: 1,
                sort_order: 0,
            };

            const response = await axios.post(`${Api}/categories`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            Swal.fire("Thành công", response.data.message, "success");
            setName("");
            fetchCategories();
        } catch (error) {
            console.error(error.response?.data);
            Swal.fire("Lỗi", "Không thể thêm danh mục", "error");
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await axios.get(`${Api}/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const category = response.data;
            setEditCategoryId(category.id);
            setEditCategoryName(category.category_name);
            setEditModalShow(true);
        } catch (error) {
            Swal.fire("Lỗi", "Không thể lấy thông tin danh mục", "error");
        }
    };

    const handleEditCategory = async () => {
      try {
          const payload = {
              category_name: editCategoryName,
              slug: editCategoryName.toLowerCase().replace(/\s+/g, "-"),
              parent: 0,
                status: 1,
                sort_order: 0,
          };
  
          const response = await axios.put(`${Api}/categories/${editCategoryId}`, payload, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });
  
          Swal.fire("Thành công", response.data.message, "success");
          setEditModalShow(false);
          fetchCategories();
      } catch (error) {
          console.error("Lỗi cập nhật:", error.response?.data || error);
          Swal.fire("Lỗi", "Không thể cập nhật danh mục", "error");
      }
  };
  

    const handleDelete = async (id) => {
        const confirm = window.confirm("Bạn có chắc muốn xoá danh mục này?");
        if (!confirm) return;

        try {
            await axios.delete(`${Api}/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire("Đã xoá", "Danh mục đã được xoá", "success");
            fetchCategories();
        } catch (error) {
            console.error(error.response?.data);
            Swal.fire("Lỗi", "Không thể xoá danh mục: Đang có sản phẩm thuộc danh mục này", "error");
        }
    };

    return (
        <div className="row">
            {/* Form tạo danh mục */}
            <div className="col-5">
                <div className="card shadow my-2 mx-2">
                    <h3 className="text-danger text-center mt-3">Tạo Danh Mục</h3>
                    <div className="mb-3 mt-3 px-3">
                        <label htmlFor="name" className="form-label ">Danh Mục</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Nhập tên danh mục"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-danger mb-3 mx-3" onClick={handleCreateCategory}>
                       Thêm
                    </button>
                </div>
            </div>

            {/* Bảng danh sách danh mục */}
            <div className="col-7">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-danger">Tất cả danh mục</h6>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên</th>
                                    <th style={{ width: "180px" }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.category_name}</td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                className="me-2"
                                                onClick={() => openEditModal(category.id)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal sửa danh mục */}
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleEditCategory}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer/>
        </div>
    );
};

export default ListCategory;
