import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Api } from "../../api/Api";
import Swal from "sweetalert2";
import Footer from '../product/Footer';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        address: '',
        phone: '',
        role: ''
    });

    const getUser = async () => {
        try {
            const response = await axios.get(`${Api}/users`);
            setUsers(response.data.data);
        } catch (error) {
            console.error("Error ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const deleteUser = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        });

        if (!isConfirm.isConfirmed) return;

        try {
            await axios.delete(`${Api}/users/${id}`);
            Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success");
            getUser();
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire("Lỗi!", "Không thể xóa người dùng.", "error");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setFormData({
            username: user.attributes.username,
            email: user.attributes.email,
            password: '',
            name: user.attributes.name,
            address: user.attributes.address,
            phone: user.attributes.phone,
            role: user.attributes.role
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            name: '',
            address: '',
            phone: '',
            role: ''
        });
    };

    const updateUser = async () => {
        try {
            await axios.put(`${Api}/users/${editingUser}`, formData);
            Swal.fire("Thành công", "Người dùng đã được cập nhật.", "success");
            handleCancel();
            getUser();
        } catch (error) {
            console.error("Lỗi khi cập nhật", error);
            Swal.fire("Lỗi", "Cập nhật thất bại", "error");
        }
    };

    const createUser = async () => {
        if (!formData.email || !formData.password) {
            Swal.fire("Lỗi", "Email và Mật khẩu là bắt buộc", "warning");
            return;
        }

        try {
            await axios.post(`${Api}/users`, formData);
            Swal.fire("Thành công", "Tài khoản đã được tạo", "success");
            handleCancel();
            getUser();
        } catch (error) {
            console.error("Lỗi khi thêm", error);
            Swal.fire("Lỗi", "Không thể tạo người dùng", "error");
        }
    };

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 className="m-0 font-weight-bold text-danger">Quản lý người dùng</h6>
                </div>
                <div className="card-body">
                    {/* Form Thêm / Sửa */}
                    <div className="mb-4">
                        <h5 className="text-danger">{editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}</h5>
                        <div className="row mb-2">
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Mật khẩu"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Họ tên"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Địa chỉ"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Số điện thoại"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Quyền (admin/user)"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button variant={editingUser ? "warning" : "danger"} onClick={editingUser ? updateUser : createUser}>
                            {editingUser ? "Cập nhật" : "Thêm mới"}
                        </Button>
                        {editingUser && (
                            <Button variant="secondary" className="ms-2" onClick={handleCancel}>
                                Hủy
                            </Button>
                        )}
                    </div>

                    {/* Danh sách người dùng */}
                    <div className="table-responsive">
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Họ tên</th>
                                    <th>Địa chỉ</th>
                                    <th>SĐT</th>
                                    <th>Quyền</th>
                                    <th>Ngày tạo</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="10">Đang tải...</td></tr>
                                ) : users.length > 0 ? (
                                    users.map((user) => {
                                        const { id, attributes } = user;
                                        return (
                                            <tr key={id}>
                                                <td>{id}</td>
                                                <td>{attributes.username}</td>
                                                <td>{attributes.email}</td>
                                                <td>{attributes.name}</td>
                                                <td>{attributes.address}</td>
                                                <td>{attributes.phone}</td>
                                                <td>{attributes.role}</td>
                                                <td>{new Date(attributes.created_at).toLocaleString()}</td>
                                                <td>{new Date(attributes.updated_at).toLocaleString()}</td>
                                                <td>
                                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(user)}>✏️Sửa</Button>
                                                    <Button variant="danger" onClick={() => deleteUser(id)}>🗑Xóa</Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="10">Không có người dùng nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default User;
