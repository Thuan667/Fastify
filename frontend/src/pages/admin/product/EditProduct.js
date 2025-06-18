import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Api } from "../../api/Api";

const EditProduct = () => {
    const { id } = useParams(); // Lấy id sản phẩm từ URL
    const [product_name, setProductName] = useState("");
    const [product_category, setProductCategory] = useState(0);
    const [price, setPrice] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [salePrice, setSalePrice] = useState(0);
    const [isSale, setIsSale] = useState(false);
    const token = localStorage.getItem('token');

    // Lấy dữ liệu sản phẩm khi trang được tải
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${Api}/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy categories:", err);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${Api}/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const product = res.data;
                setProductName(product.product_name);
                setProductCategory(product.product_category);
                setPrice(product.price);
                setDescription(product.description);
                setIsSale(product.sale === 1);
                setSalePrice(product.sale_price);
                setImagePreviews([product.image]);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };

        if (token) {
            fetchCategories();
            fetchProduct();
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        switch (name) {
            case 'product_name':
                setProductName(value);
                break;
            case 'product_category':
                setProductCategory(Number(value));
                break;
            case 'price':
                setPrice(parseFloat(value));
                break;
            case 'description':
                setDescription(value);
                break;
            case 'sale_price':
                setSalePrice(parseFloat(value));
                break;
            case 'sale':
                setIsSale(checked);
                break;
            default:
                break;
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${Api}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data.filename;
        } catch (err) {
            console.error("Upload failed:", err);
            throw new Error("Không thể upload hình ảnh.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (product_category === 0) {
            setErrorMessage("Vui lòng chọn loại sản phẩm.");
            return;
        }
    
        if (photos.length === 0 && imagePreviews.length === 0) {
            setErrorMessage("Vui lòng chọn ít nhất một hình ảnh.");
            return;
        }
    
        try {
            const uploadedFilename = photos.length > 0 ? await uploadImage(photos[0]) : imagePreviews[0];
    
            const data = {
                product_name,
                slug: generateSlug(product_name),
                product_category,
                description,
                image: uploadedFilename,
                price: parseFloat(price),
                sale: isSale ? 1 : 0,
                sale_price: isSale ? parseFloat(salePrice) : 0,
                product_available: true,
                updated_at: new Date().toISOString(),
                status: 1
            };
    
            console.log("Dữ liệu gửi đi:", data); // Kiểm tra dữ liệu trước khi gửi
    
            const response = await axios.put(`${Api}/products/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
    
            Swal.fire("Thành công", response.data.message || "Cập nhật sản phẩm thành công!", "success")
                .then(() => navigate("/admin/product"));
    
        } catch (err) {
            console.error(err.response?.data || err);
            setErrorMessage("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
    };

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Sửa sản phẩm</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên sản phẩm</label>
                            <input
                                className="form-control"
                                name="product_name"
                                value={product_name}
                                onChange={handleChange}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Loại</label>
                            <select
                                className="form-control"
                                name="product_category"
                                value={product_category}
                                onChange={handleChange}
                            >
                                <option value={0} disabled>Chọn loại sản phẩm</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Giá</label>
                            <input
                                className="form-control"
                                name="price"
                                value={price}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hình ảnh</label>
                            <input
                                className="form-control"
                                name="photo"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ảnh xem trước:</label>
                            <div className="d-flex flex-wrap">
                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`preview-${index}`} style={{ width: "70px", height: "70px", marginRight: "10px" }} />
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Giảm giá</label>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="saleCheck"
                                    checked={isSale}
                                    onChange={(e) => setIsSale(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="saleCheck">
                                    Có khuyến mãi?
                                </label>
                            </div>
                        </div>

                        {isSale && (
                            <div className="form-group">
                                <label>Giá khuyến mãi</label>
                                <input
                                    type="number"
                                    name="sale_price"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(parseFloat(e.target.value))}
                                    className="form-control"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                rows="3"
                                className="form-control"
                                name="description"
                                value={description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary btn-block">
                                Cập nhật
                            </button>
                        </div>

                        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
