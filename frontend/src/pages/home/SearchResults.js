import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Api } from '../api/Api';
import { ToastContainer } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import ProductItem from '../products/ProductItem';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Các state lọc
  const [productCategory, setProductCategory] = useState('');
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [categories, setCategories] = useState([]); // <-- Thêm danh sách danh mục

  // Lấy danh mục khi load component
  useEffect(() => {
    axios.get(`${Api}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Api}/products/search`, {
        params: {
          name: searchQuery,
          product_category: productCategory ? Number(productCategory) : undefined,
          min_price: minPrice ? Number(minPrice) : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
        },
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  const uniqueProducts = Array.from(new Set(searchResults.map(p => p.id)))
    .map(id => searchResults.find(p => p.id === id));

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

            {/* ===== Bộ lọc ===== */}
            <div className="row mb-3">
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Giá từ"
                  className="form-control"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Giá đến"
                  className="form-control"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <button className="btn btn-danger w-100" onClick={fetchSearchResults}>
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>

            {/* ===== Kết quả ===== */}
            {loading ? (
              <div className="spinner-container">
                <Spinner animation="border" />
              </div>
            ) : (
              <div id="product-container" className="row-lg-12">
                <div className="col">
                  <div className="products-tabs">
                    <div className="products-slick">
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
