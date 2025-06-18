import { Link } from "react-router-dom";
import "../../Layouts/css/Delivery.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { Api } from '../api/Api';

const Sidebar = () => {
    const [user, setUser] = useState(null); // user là object, không phải array

  const getUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${Api}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const userData = response.data.data?.[0]; // lấy phần tử đầu tiên trong mảng
        console.log("User từ API:", userData);
        setUser(userData?.attributes); // chỉ lấy phần attributes
    } catch (error) {
        console.log("Lỗi khi gọi user", error);
    }
}


    useEffect(() => {
        getUser();
    }, []); // 👈 Thêm [] để tránh gọi liên tục

    return (
        <div className="sidebar">
            <div className="profile-section">
                {user && (
                    <div>
                        <div className="username">Tên :{user.username}</div>
                        <div className="email">Email :{user.email}</div>
                    </div>
                )}
            </div>
            <ul className="menu">
                <Link><li className="active">Đơn Mua</li></Link>
            </ul>
        </div>
    );
}

export default Sidebar;
