import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { Api } from './../api/Api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function QucikView(props) {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [addedToWishlist, setAddedToWishlist] = useState(false); // Trạng thái yêu thích
    const [rating, setRating] = useState(0); // Đánh giá sao
const navigate = useNavigate();

    const handleClose = () => {
        props.hideQuickView();
        setAddedToCart(false); 
    };
const handleViewDetail = () => {
    if (product && product.id) {
        handleClose();
        navigate(`/products/${product.id}`);
    }
};


    const handleAddToCart = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const user_id = user ? user.id : null;
    
            if (!user_id || !token) {
                toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
                return;
            }
    
            const product_id = product ? product.id : null;
            if (!product_id) {
                toast.error("Không có sản phẩm để thêm vào giỏ hàng!");
                return;
            }
    
            // Thêm sản phẩm vào giỏ hàng trước
            const response = await axios.post(`${Api}/carts`, {
                user_id,
                product_id,
                quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    
            // Kiểm tra giỏ hàng hiện tại của người dùng
            const existingCartResponse = await axios.get(`${Api}/carts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            // Kiểm tra nếu dữ liệu là một mảng và có ít nhất 1 phần tử
            if (Array.isArray(existingCartResponse.data) && existingCartResponse.data.length > 0) {
                const existingProduct = existingCartResponse.data.find(item => item.user_id === user_id && item.product_id === product_id);
    
                if (existingProduct) {
                    const updatedQuantity = existingProduct.quantity + quantity;
    
                    await axios.put(`${Api}/carts/${existingProduct.id}`, {
                        user_id,
                        product_id,
                        quantity: updatedQuantity,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    
                    toast.success("Số lượng sản phẩm trong giỏ hàng đã được cập nhật!");
                }
                
            }
             setAddedToCart(true);
            setTimeout(() => {
                handleClose();
            }, 1000);
    
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error.message);
            toast.error("Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
        }
    };
    
    

    // Hàm thêm vào yêu thích
 const handleAddToWishlist = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        const user_id = user ? user.id : null;

        if (!user_id || !token) {
            toast.error("Vui lòng đăng nhập để thêm vào yêu thích.");
            return;
        }

        const product_id = product ? product.id : null;
        if (!product_id) {
            toast.error("Không có sản phẩm để thêm vào yêu thích!");
            return;
        }

        // Thêm vào wishlist
        const response = await axios.post(`${Api}/wishlists`, {
            user_id,
            product_id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        toast.success("Sản phẩm đã được thêm vào danh sách yêu thích!");
        setAddedToWishlist(true);

    } catch (error) {
        console.error("Lỗi khi thêm vào yêu thích:", error.response?.data || error.message);
        toast.error("Sản phẩm đã có trong danh sách yêu thích của bạn!");
    }
};

    

    useEffect(() => {
        if (props.productId) {
            setLoading(true);
            setAddedToCart(false);
            axios.get(`${Api}/products/${props.productId}`).then(response => {
                setProduct(response.data.data.attributes);
                console.log("api",response.data.data.attributes)
                setLoading(false);
            });
        }
    }, [props.productId]);

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1); // Đánh giá từ 1 đến 5 sao
    };

    return (
        <>
       
        <Modal size="lg" show={props.showModal} onHide={handleClose} centered>
        <ToastContainer />
            <Modal.Header closeButton style={{ borderBottom: 'none' }}>
                <Modal.Title style={{ color: '#c0392b', fontWeight: 'bold' }}>
                    {product && product.product_name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                    </div>
                ) : (
                    product && (
                        <div className="row align-items-center">
                            <div className="col-md-6 text-center mb-3">
                                <img
                                    src={`http://localhost:3000/public/${product.image}`}
                                    alt={product.product_name}
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    }}
                                />
                            </div>
                            <div className="col-md-6">
                                <h4 className="mb-3" style={{ color: '#c0392b' }}>
                                    {product.product_name}
                                </h4>
                                <p style={{ fontSize: '18px' }}>
                                    <strong style={{ color: '#c0392b' }}>Giá:</strong> {product.price} VND
                                </p>

                                <div className="d-flex align-items-center mb-3">
                                    <button
                                        onClick={handleAddToWishlist}
                                        style={{
                                            backgroundColor: '#f39c12',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {addedToWishlist ? '✅ Đã thêm vào yêu thích' : '❤️ Thêm vào yêu thích'}
                                    </button>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        min="1"
                                        max="10"
                                        style={{
                                            width: '70px',
                                            padding: '5px 10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addedToCart}
                                        style={{
                                            backgroundColor: addedToCart ? '#27ae60' : '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            transition: '0.3s',
                                            cursor: addedToCart ? 'default' : 'pointer',
                                        }}
                                    >
                                        {addedToCart ? '✅ Đã thêm' : '🛒 Thêm vào giỏ'}
                                    </button>
                                    <div className="d-flex align-items-center mb-3">
 
</div>

                                </div>

                                <p style={{ fontStyle: 'italic', color: '#555' }}>
                                    {product.description}
                                </p>
                                   <button
        onClick={handleViewDetail}
        style={{
            backgroundColor: '#2980b9',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: 'pointer',
        }}
    >
        🔍 Xem chi tiết
    </button>
                            </div>
                        </div>
                    )
                )}
            </Modal.Body>
        </Modal>
        </>
    );
}

export default QucikView;
