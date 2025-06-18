import React from 'react';
import '../Layouts/css/Sport.css'; 

const sports = [
  { name: 'Thời trang', image: require('../assets/img/season_coll_1_img.webp') },
  { name: 'Pickleball', image: require('../assets/img/season_coll_3_img.webp') },
  { name: 'Golf', image: require('../assets/img/season_coll_5_img.webp') },
  { name: 'Bóng đá', image: require('../assets/img/season_coll_7_img.webp') },
  { name: 'Chạy bộ', image: require('../assets/img/season_coll_2_img.webp') },
  { name: 'Tennis', image: require('../assets/img/season_coll_4_img.webp') },
  { name: 'Bóng rổ', image: require('../assets/img/season_coll_6_img.webp') },
  { name: 'Tập luyện', image: require('../assets/img/season_coll_8_img.webp') },
];

const Sport = () => {
  return (
    <div className="sport-container">
      <h1 className="sport-title">MÔN THỂ THAO</h1>
      <div className="sport-list">
        {sports.map((sport, index) => (
          <div key={index} className="sport-item">
            <img src={sport.image} alt={sport.name} className="sport-image" />
            <span className="sport-name">{sport.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sport;
