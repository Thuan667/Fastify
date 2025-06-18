import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import '../Layouts/css/Banner.css';
import { Api } from "../pages/api/Api";
const token = localStorage.getItem('token'); // Lấy token từ localStorage

const Banner = () => {
  const [banners, setBanners] = useState([]); // state để lưu danh sách banner

  useEffect(() => {
    // Gọi API để lấy danh sách banner
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${Api}/banners`,{
          headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization
          },
        }); 
        console.log("Response:", response); // 👈 Thêm dòng này
        setBanners(response.data); // Lưu danh sách banner vào state
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []); // useEffect chỉ chạy một lần khi component được render

  return (
    <Carousel>
      {/* Kiểm tra xem có banner nào không */}
      {banners.length > 0 ? (
        banners.map((banner, index) => (
          <Carousel.Item key={banner.id} interval={2000}>
            {/* Hiển thị hình ảnh từ API */}
            <img
              className="d-block w-100"
              src={`http://localhost:3000/public/${banner.image}`}
                            alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))
      ) : (
        // Nếu chưa có dữ liệu banner, có thể hiển thị banner mặc định
        <Carousel.Item interval={2000}>
          <img
            className="d-block w-100"
            src={require("../assets/img/slider_3.webp")}
            alt="Default slide"
          />
        </Carousel.Item>
      )}
    </Carousel>
  );
};

export default Banner;
