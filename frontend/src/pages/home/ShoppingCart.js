import React from 'react';
import axios from 'axios';
import { Api } from '../api/Api';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            loading: false,
            totalPrice: 0,
            selectedItems: [],
            isLoggedIn: !!localStorage.getItem('user'), // kiểm tra đăng nhập,
             cartCount: 0,
        };
    }

componentDidMount() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.id) {
    this.setState({ isLoggedIn: true });
    this.getShoppingCartList(user.id);
    this.fetchCartCount(user.id);  // <-- thêm dòng này
  } else {
    this.setState({ isLoggedIn: false });
  }
}

fetchCartCount = (userId) => {
  axios.get(`${Api}/carts/count`, {
    params: { user_id: userId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
  .then(res => {
    if (res.data && typeof res.data.count === 'number') {
      this.props.updateCartCount?.(res.data.count);
      localStorage.setItem('cartCount', res.data.count);
    }
  })
  .catch(err => {
    console.error('Lỗi khi đếm giỏ hàng:', err);
  });
}


    getShoppingCartList = (userId) => {
        this.setState({ loading: true });

        axios
            .get(`${Api}/carts/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                 console.log('Dữ liệu giỏ hàng nhận được:', response.data);
                const cartItems = response.data.data;
                this.setState({
                    cartList: cartItems,
                    loading: false,
                }, () => {
                    localStorage.setItem('cartCount', this.state.cartList.length);
                    localStorage.setItem('checkoutList', JSON.stringify(this.state.selectedItems)); // Lưu chỉ các sản phẩm đã chọn
                });

                this.calcTotal(cartItems);
                this.props.updateCartCount?.(cartItems.length);
            })
            .catch((error) => {
                console.error('Lỗi khi tải giỏ hàng:', error);
                this.setState({ loading: false });
            });
    };

calcTotal = (selectedItems) => {
    const total = selectedItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);
    this.setState({ totalPrice: total });
};

	handleCheckboxChange = (itemId) => {
		this.setState((prevState) => {
		  // Lấy danh sách các item đã chọn
		  const selectedItems = [...prevState.selectedItems];
		  
		  // Tìm sản phẩm trong giỏ hàng
		  const item = prevState.cartList.find((product) => product.id === itemId);
	  
		  // Kiểm tra nếu sản phẩm đã có trong selectedItems
		  if (selectedItems.some((selectedItem) => selectedItem.id === itemId)) {
			// Nếu sản phẩm đã có trong selectedItems, bỏ chọn
			const updatedItems = selectedItems.filter((selectedItem) => selectedItem.id !== itemId);
			selectedItems.length = 0;  // Clear the selectedItems array
			selectedItems.push(...updatedItems);  // Assign the filtered items back
		  } else {
			// Nếu chưa có, thêm vào selectedItems
			selectedItems.push(item);
		  }
	  
		  // Sau khi thay đổi selectedItems, cập nhật lại totalPrice
		  this.calcTotal(selectedItems);
	  
		  // Cập nhật lại selectedItems vào localStorage
		  localStorage.setItem('checkoutList', JSON.stringify(selectedItems));
	  
		  return { selectedItems };
		});
	  };
	  
	  handleSelectAllChange = (e) => {
		const { cartList } = this.state;
		const selectedItems = e.target.checked ? [...cartList] : [];
	
		this.calcTotal(selectedItems); // truyền đúng danh sách item
	
		localStorage.setItem('checkoutList', JSON.stringify(selectedItems));
	
		this.setState({ selectedItems });
	};
	


   deleteCartItem = (itemId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
        axios
            .delete(`${Api}/carts/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(() => {
                // Lọc lại danh sách cart sau khi xóa
                const newCartList = this.state.cartList.filter(item => item.id !== itemId);

                // Lọc lại selectedItems, bỏ các item đã bị xóa
                const newSelectedItems = this.state.selectedItems.filter(item => item.id !== itemId);

                // Cập nhật state đồng thời cập nhật tổng tiền
                this.setState({
                    cartList: newCartList,
                    selectedItems: newSelectedItems
                }, () => {
                    // Cập nhật lại tổng tiền dựa trên selectedItems mới
                    this.calcTotal(newSelectedItems);

                    // Cập nhật lại cartCount
                    this.props.updateCartCount?.(newCartList.length);
                    localStorage.setItem('cartCount', newCartList.length);
                   this.fetchCartCount(user.id);
                    // Cập nhật lại danh sách checkout đã chọn trong localStorage
                    localStorage.setItem('checkoutList', JSON.stringify(newSelectedItems));
                });

                toast.success('Xóa sản phẩm thành công!');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm:', error);
                toast.error('Xóa sản phẩm thất bại!');
            });
    }
};


    handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        axios.put(`${Api}/carts/${itemId}`,
            { quantity: newQuantity },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        .then(() => {
            const updatedCartList = this.state.cartList.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            this.setState({ cartList: updatedCartList }, () => {
                this.calcTotal(this.state.selectedItems);
            });
            toast.success('Cập nhật số lượng thành công!');
        })
        .catch((error) => {
            console.error('Lỗi khi cập nhật số lượng:', error);
            toast.error('Cập nhật số lượng thất bại!');
        });
    };

    render() {
        const { cartList, loading, totalPrice, selectedItems, isLoggedIn } = this.state;

        if (!isLoggedIn) {
            return (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                    <h2 style={{ color: '#e53935' }}>🛒 Giỏ hàng</h2>
                    <p>Bạn cần <a href="/login" style={{ color: '#e53935', fontWeight: 'bold' }}>đăng nhập</a> để xem giỏ hàng.</p>
                </div>
            );
        }

        if (loading) {
            return <div style={{ padding: 20 }}>Đang tải giỏ hàng...</div>;
        }

        return (
            <div style={{ maxWidth: '950px', margin: 'auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h2 style={{ color: '#e53935', marginBottom: '30px', textAlign: 'center' }}>🛒 Giỏ hàng</h2>
                {cartList.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>
                        <p>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào.</p>
                        <button
                            style={{
                                backgroundColor: '#e53935',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <input
                                type="checkbox"
                                onChange={this.handleSelectAllChange}
                                checked={selectedItems.length === cartList.length}
                            />
                            <span style={{ marginLeft: '10px' }}>Chọn tất cả</span>
                        </div>

                        {cartList.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                    padding: '15px',
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                            >
                                <input
                                    type="checkbox"
									checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}                                    onChange={() => this.handleCheckboxChange(item.id)}
                                    style={{ marginRight: '20px' }}
                                />
                                <img
                                    src={`http://localhost:3000/public/${item.product.image}`}
                                    alt={item.product.product_name}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        marginRight: '20px',
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>{item.product.product_name}</h4>
                                    <p style={{ fontSize: '16px', color: '#666', margin: '4px 0' }}>
                                        Giá: <strong style={{ color: '#e53935' }}>{item.product.price} </strong>
                                    </p>
                                                                        <p style={{ fontSize: '16px', color: '#666', margin: '4px 0' }}>
                                       Số Lượng : <strong style={{ color: '#e53935' }}>{item.quantity}</strong>
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#888' }}>{item.product.short_description}</p>
                                    <div>
                                        <button
                                            onClick={() => this.deleteCartItem(item.id)}
                                            style={{
                                                backgroundColor: '#e53935',
                                                color: 'white',
                                                padding: '5px 10px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                marginRight: '10px',
											}}
											>
												Xóa
											</button>
										</div>
									</div>
								</div>
							))}
		
							<div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '20px' }}>
								<h3>Tổng cộng: {totalPrice} đ</h3>
							</div>
		
							<div style={{ textAlign: 'center', marginTop: '30px' }}>
								<Link to="/checkout">
									<button
										style={{
											backgroundColor: '#e53935',
											color: 'white',
											padding: '10px 20px',
											border: 'none',
											borderRadius: '5px',
											fontSize: '16px',
											cursor: 'pointer',
										}}
									>
										Tiến hành thanh toán
									</button>
								</Link>
							</div>
						</div>
					)}
		
					<ToastContainer />
				</div>
			);
		}
	}

	export default ShoppingCart;