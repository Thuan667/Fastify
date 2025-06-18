import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Collections.css'; // Đảm bảo đường dẫn đúng tới file CSS mới

const Collections = () => (
  <div className="section bg-light py-5">
    <div className="container">
      <div className="row">
        <div className="col-md-4 col-xs-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="shop-img">
              <img src="../../img/lookbook_1_image.png
              " className="card-img-top" alt="Laptop" />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title"></h5>
              <a href="#" className="btn btn-primary">
                Mua ngay <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-xs-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="shop-img">
              <img src="../../img/lookbook_2_image.png" className="card-img-top" alt="Phụ kiện" />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title"></h5>
              <a href="#" className="btn btn-primary">
                Mua ngay <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-xs-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="shop-img">
              <img src="../../img/lookbook_3_image.png" className="card-img-top" alt="Điện thoại" />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title"></h5>
              <a href="#" className="btn btn-primary">
                Mua ngay <i className="fa fa-arrow-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Collections;
