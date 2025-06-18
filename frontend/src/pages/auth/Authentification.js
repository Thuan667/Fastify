import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Login";
import Register from "./Register";

const Authentification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user_data);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch({ type: "USER", value: parsedUser });
      console.log("Loaded user from localStorage:", parsedUser);
    } else if (token && !storedUser) {
      getAuth(token);
    } else {
      dispatch({ type: "USER", value: null });
    }
  }, [dispatch]);

  const getAuth = (token) => {
    axios
      .get("http://localhost:3000/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.users;
        console.log("Fetched user:", user);
        dispatch({ type: "USER", value: user });
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err) => {
        console.error("Auth failed:", err);
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartCount");
    localStorage.removeItem("wishlistCount");
    dispatch({ type: "USER", value: null });
  };

  const handleClick = (e) => {
    const actionId = e.target.id;
    switch (actionId) {
      case "0":
        navigate("admin");
        break;
      case "1":
        navigate("my-account");
        break;
      case "2":
        navigate("track-oder");
        break;
      case "3":
        logout();
        break;
      default:
        break;
    }
  };

  return user ? (
    <li>
      <Dropdown>
        <Dropdown.Toggle variant="toggle" id="dropdown-basic">
          <i className="fa fa-user-o" style={{ color: "black" }}></i>
          <span style={{ color: "red" }}>
            <strong>{user.username || user.name}</strong>
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu onClick={handleClick}>
          {user.role === "admin" && (
            <Dropdown.Item id="0">Quản Trị</Dropdown.Item>
          )}
          <Dropdown.Item id="1">Tài Khoản của tôi</Dropdown.Item>
          <Dropdown.Item id="2">Quản lí đơn hàng</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item id="3">
            <i className="fa fa-sign-out" aria-hidden="true"></i> Đăng Xuất
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ) : (
    <>
      <li>
        <Login />
      </li>
      <li>
        <Register />
      </li>
    </>
  );
};

export default Authentification;
