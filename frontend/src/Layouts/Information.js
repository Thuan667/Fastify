import React from 'react';
import '../Layouts/css/Information.css'; 

const informationData = [
  {
    image: require('../assets/img/500x400-8f2ab0fd-0c5f-4a1b-8ca9-0d85b864ec3e.webp'),
    text: 'Từ nhà vô địch marathon tới những tín đồ yoga, từ người mới bắt đầu cho đến vận động viên---KHÁM PHÁ HỆ THỐNG SIÊU THỊ THỂ THAO MAXXSPORT - ĐIỂM ĐẾN TIN CẬY DÀNH CHO MỌI NGƯỜI, MỌI NHÀ',
  },
  {
    image: require('../assets/img/500x400px.webp'),
    text: 'Từ nhà vô địch marathon tới những tín đồ yoga, từ người mới bắt đầu cho đến vận động viên---KHÁM PHÁ HỆ THỐNG SIÊU THỊ THỂ THAO MAXXSPORT - ĐIỂM ĐẾN TIN CẬY DÀNH CHO MỌI NGƯỜI, MỌI NHÀ',
  },
   
];

const Information = () => {
  return (
    <div className="information-container">
      {/* Phần bên trái */}
      <div className="information-left">
        <div className="information-header">
          <div className="information-title">TIN TỨC</div>
        </div>
        <div className="information-content">
          {informationData.map((item, index) => (
            <div key={index} className="information-item">
              <img src={item.image} alt={`News ${index}`} className="information-image" />
              <p className="information-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phần bên phải */}
      <div className="information-right">
        <div className="information-header">
          <div className="information-title">KHUYẾN MÃI</div>
        </div>
        <div className="information-content">
          {informationData.map((item, index) => (
            <div key={index} className="information-item">
              <img src={item.image} alt={`News ${index}`} className="information-image" />
              <p className="information-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Information;
