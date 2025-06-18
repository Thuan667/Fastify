import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Api } from '../api/Api';
import { ToastContainer } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import ProductItem from '../products/ProductItem'; // Import component ProductItem

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Api}/products/search`, {
params: { name: searchQuery } // thay vì query: searchQuery
      });
      console.log("API Response:", response.data);
      setSearchResults(response.data.data); // ✅ lấy đúng mảng
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSearchResults();
}, [searchQuery]);


  // Lọc các sản phẩm duy nhất
  const uniqueProducts = Array.from(new Set(searchResults.map(product => product.id)))
    .map(id => {
      return searchResults.find(product => product.id === id);
    });

  return (
    <div>
      <div className="section">
        <ToastContainer />
        <div className="container">
          <div className="col">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Kết quả tìm kiếm cho: {searchQuery}</h3>
              </div>
            </div>
            {loading ? (
              <div className="spinner-container">
                <Spinner animation="border" />
              </div>
            ) : (
              <div id="product-container" className="row-lg-12">
                <div className="col">
                  <div className="products-tabs">
                    <div className="products-slick">
                      {/* Hiện tất cả sản phẩm mà không cần phân trang */}
                      <div className="row">
                        {uniqueProducts.length > 0 ? (
                          uniqueProducts.map((product) => (
                            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                              <ProductItem product={product} />
                            </div>
                          ))
                        ) : (
                          <p>Không tìm thấy sản phẩm nào.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ paddingBottom: 50 }}></div>
    </div>
  );
};

export default SearchResults;
