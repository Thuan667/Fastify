// src/components/ListProduct.js

import React, { Component } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from '../product/Footer';
import { Api } from "../../api/Api";

const token = localStorage.getItem('token');

class ListProduct extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      currentPage: 1,
      perPage: 10,
      total: 0,
      products: [],
      trashedProducts: [],
      showTrash: false,
    };
  }

  componentDidMount() {
    this.getProducts();
    this.getTrashedProducts();
  }

  // Sản phẩm chưa xóa mềm
  getProducts(pageNumber = 1) {
    this.setState({ loading: true });

    Axios.get(`${Api}/products?page=${pageNumber}&limit=${this.state.perPage}`)
      .then((res) => {
        const products = Array.isArray(res.data?.data) ? res.data.data : [];

        this.setState({
          products,
          currentPage: res.data.meta?.pagination?.page || 1,
          perPage: res.data.meta?.pagination?.pageSize || 10,
          total: res.data.meta?.pagination?.total || 0,
          loading: false,
        });
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        this.setState({ products: [], loading: false });
      });
  }

  // Sản phẩm đã xóa mềm (trong thùng rác)
  getTrashedProducts() {
    Axios.get(`${Api}/products/trashed?page=1&limit=100`)
      .then((res) => {
        const trashedProducts = Array.isArray(res.data?.data) ? res.data.data : [];
        this.setState({ trashedProducts });
      })
      .catch((err) => {
        console.error("Error fetching trashed products:", err);
        this.setState({ trashedProducts: [] });
      });
  }

  // Xóa mềm sản phẩm
  handleSoftDeleteProduct = (productId) => {
    if (!token) return;

    Axios.delete(`${Api}/products/trash/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        Swal.fire("Đã chuyển vào thùng rác", "", "success");
        this.getProducts(this.state.currentPage);
        this.getTrashedProducts();
      })
      .catch((err) => {
         Swal.fire("Sản phẩm đang tồn tại trong giỏ hàng hoặc danh sách yêu thích. Không thể xóa.", err);
        
      });
  };

  // Phục hồi sản phẩm
  handleRestoreProduct = (productId) => {
    if (!token) return;

    Axios.put(`${Api}/products/restore/${productId}`, null, {
      headers: { Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"},
    })
      .then(() => {
        Swal.fire("Đã phục hồi sản phẩm", "", "success");
        this.getProducts(this.state.currentPage);
        this.getTrashedProducts();
      })
      .catch((err) => {
        console.error("Lỗi khi phục hồi sản phẩm:", err);
      });
  };
  // xóa vĩnh viễn
handlePermanentDeleteProduct = (productId) => {
  if (!token) return;

  Swal.fire({
    title: "Bạn có chắc muốn xóa vĩnh viễn?",
    text: "Thao tác này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa vĩnh viễn",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.delete(`${Api}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          Swal.fire("Đã xóa vĩnh viễn!", "", "success");
          this.getTrashedProducts(); // Cập nhật lại danh sách thùng rác
        })
        .catch((error) => {
          Swal.fire("Lỗi khi xóa vĩnh viễn sản phẩm: Sản phẩm đang có thao tác.", error);
        });
    }
  });
};

  renderTableRows = (products, isTrash = false) => {
    return products.map((product) => {
      const {
        product_name,
        product_category,
        description,
        price,
        image,
        sale,
        sale_price,
        slug,
        status,
        created_at,
      } = product.attributes || {};

      return (
        <tr key={product.id}>
          <td>{product.id}</td>
          <td>{product_name || "Không có tên"}</td>
          <td>{product_category || "Không có danh mục"}</td>
          <td>{description || "Không có mô tả"}</td>
          <td>{price ? price.toLocaleString() : "Không có giá"}</td>
          <td>{sale ? <span className="text-success">✔</span> : <span className="text-danger">✘</span>}</td>
          <td>{sale_price ? sale_price.toLocaleString() : "Không có giá KM"}</td>
          <td>{slug || "Không có slug"}</td>
          <td>{status === 1 ? <span className="badge bg-success">Hiển thị</span> : <span className="badge bg-danger">Ẩn</span>}</td>
          <td>{new Date(created_at).toLocaleDateString()}</td>
          <td style={{ textAlign: "center" }}>
            <img src={`http://localhost:3000/public/${image}`} alt={product_name} width="70" height="70" />
          </td>
          <td>
        {isTrash ? (
  <>
    <Button variant="success" onClick={() => this.handleRestoreProduct(product.id)} className="me-2">
      Phục hồi
    </Button>
    <Button variant="danger" onClick={() => this.handlePermanentDeleteProduct(product.id)}>
      Xóa vĩnh viễn
    </Button>
  </>
) : (
  <>
    <Link to={`/admin/products/edit/${product.id}`} className="btn btn-dark me-2">Sửa</Link>
    <Button variant="danger" onClick={() => this.handleSoftDeleteProduct(product.id)}>Xóa</Button>
  </>
)}

          </td>
        </tr>
      );
    });
  };

  render() {
    const { loading, products, trashedProducts, perPage, total, currentPage } = this.state;

    return (
      <div className="container-fluid">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 className="m-0 font-weight-bold text-dark">Quản Lý Sản Phẩm</h6>
            <Link to="/admin/product/create" className="btn btn-danger">Thêm sản phẩm</Link>
          </div>
          <div className="card-body">
            <Tabs defaultActiveKey="active" className="mb-3">
              <Tab eventKey="active" title="Danh sách sản phẩm">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Mô tả</th>
                        <th>Giá gốc</th>
                        <th>Giảm giá?</th>
                        <th>Giá KM</th>
                        <th>Slug</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hình ảnh</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="12" className="text-center"><Spinner animation="border" /></td></tr>
                      ) : products.length === 0 ? (
                        <tr><td colSpan="12" className="text-center">Không có sản phẩm nào.</td></tr>
                      ) : (
                        this.renderTableRows(products, false)
                      )}
                    </tbody>
                  </table>
                </div>
                {total > perPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={perPage}
                      totalItemsCount={total}
                      pageRangeDisplayed={4}
                      onChange={(page) => this.getProducts(page)}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </div>
                )}
              </Tab>

              <Tab eventKey="trash" title="Thùng rác">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Mô tả</th>
                        <th>Giá gốc</th>
                        <th>Giảm giá?</th>
                        <th>Giá KM</th>
                        <th>Slug</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hình ảnh</th>
                        <th>Phục hồi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trashedProducts.length === 0 ? (
                        <tr><td colSpan="12" className="text-center">Không có sản phẩm nào trong thùng rác.</td></tr>
                      ) : (
                        this.renderTableRows(trashedProducts, true)
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ListProduct;
