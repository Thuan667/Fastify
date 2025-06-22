import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Api } from './../api/Api';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            address: '',
            total: 0,
            redirect: false,
            checkoutList: [],
            provinces: '',
            district: '',
            wards: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        // this.handleVNPAYPayment = this.handleVNPAYPayment.bind(this); // Hàm mới cho thanh toán VNPAY
    }

    componentDidMount() {
        if (localStorage.getItem('selectedList')) {
            if (localStorage.getItem('token')) {
                this.getShoppingCartList();
            } else {
                this.getGuestShoppingCartList(localStorage.getItem('cartList'));
            }
        } else {
            if (!localStorage.getItem('checkoutList')) {
                this.setState({ redirect: true });
            } else {
                const list = JSON.parse(localStorage.getItem('checkoutList'));
                const total = parseFloat(localStorage.getItem('total')) || 0;  
                this.setState({ checkoutList: list, total }, () => {
                    if (!localStorage.getItem('total')) {
                        this.calcTotal(list);
                    }
                });
            }
        }
        this.calcTotal();
    }

    componentDidUpdate(prevProps) {
        if (this.props.user && this.props.user !== 'guest') {
            if (prevProps.user.id !== this.props.user.id) {
                this.getUserDefaultAddress();
            }
        }
    }

    getShoppingCartList() {
        axios.get(`${Api}/product/cart-list/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            this.setState({
                checkoutList: [...response.data],
            });
            this.generateCheckoutList();
            this.getUserDefaultAddress();
        }).catch(function (error) {
            console.log(error);
        });
    }

    getGuestShoppingCartList(localCartList) {
        axios.post(`${Api}/product/cart-list/guest`, {
            cartList: localCartList,
        }).then((response) => {
            this.setState({
                checkoutList: [...response.data],
            });
            this.generateCheckoutList();
        });
    }

    generateCheckoutList() {
        let checkoutList = this.state.checkoutList;
        let selectedList = JSON.parse(localStorage.getItem('selectedList'));
    
        if (localStorage.getItem('token')) {
            checkoutList = checkoutList.filter((item) => selectedList.includes(item.id));
        } else {
            checkoutList = checkoutList.filter((item, index) => selectedList.includes(index + 1));
        }
    
        localStorage.setItem('checkoutList', JSON.stringify(checkoutList));
        localStorage.removeItem('selectedList');
    
        this.setState({ checkoutList: [...checkoutList] });
        this.calcTotal(checkoutList);
    }
    

    calcTotal(list = this.state.checkoutList) {
        const total = list.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const quantity = item.quantity || 1;
            return acc + price * quantity;
        }, 0);
        this.setState({ total });
    }
    

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    }

    handlePayment = async () => {
        const { name, phone, email, total, checkoutList, provinces, district, wards, address } = this.state;
    
        // Kiểm tra xem checkoutList có rỗng không
        if (checkoutList.length === 0) {
            alert("Giỏ hàng không có sản phẩm.");
            return;
        }
    
        // Lấy user_id từ localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const user_id = user?.id || null;
    
        if (!name || !phone || !email || !address || !provinces || !district || !wards) {
            alert("Vui lòng điền tất cả các trường cần thiết.");
            return;
        }
    
        // Format lại dữ liệu sản phẩm đúng với backend
        const products = checkoutList.map(item => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.product?.price || 0,
        }));
    
        if (products.length === 0) {
            alert("Không có sản phẩm hợp lệ trong giỏ hàng.");
            return;
        }
    
        const orderData = {
            user_id,
            total_money: total,
            address,
            district,
            email,
            name,
            phone,
            provinces,
            wards,
            products,
            created_at: new Date().toISOString(), // Thêm thời gian tạo đơn hàng
        };
    
        try {
            // Gửi yêu cầu tạo đơn hàng
            const response = await axios.post(`${Api}/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            console.log('Order created:', response.data);
    
            // Sau khi tạo đơn hàng thành công, xóa giỏ hàng trong database
            const cartItems = checkoutList.map(item => item.id);  // Lấy các ID sản phẩm trong giỏ hàng
            for (const cartId of cartItems) {
                // Gọi API hoặc sử dụng hàm xóa giỏ hàng
                await this.deleteCartFromDatabase(cartId);
            }
    
            // Sau khi xóa giỏ hàng từ database, cập nhật lại frontend
            this.setState({ cartList: [] });  // Xóa giỏ hàng trên frontend
    
            // Cập nhật lại localStorage
            localStorage.removeItem('checkoutList');
            localStorage.setItem('cartCount', '0');
    
            // Nếu dùng Redux, có thể dispatch action để xóa giỏ hàng
            this.props.clearCart?.();
    
            alert("Thanh toán thành công và giỏ hàng đã được xóa.");
            window.location.href = '/track-oder';
        } catch (error) {
            console.error('Order error:', error);
            alert('Đặt hàng thất bại. Vui lòng thử lại!');
        }
    };
    
    // Hàm xóa sản phẩm khỏi giỏ hàng trong database
    deleteCartFromDatabase = async (cartId) => {
        try {
            const response = await axios.delete(`${Api}/carts/${cartId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
    
            console.log(`Sản phẩm với ID ${cartId} đã bị xóa khỏi giỏ hàng.`);
        } catch (error) {
            console.error(`Lỗi khi xóa sản phẩm với ID ${cartId} khỏi giỏ hàng:`, error);
        }
    };
       
    
    
    

    // handleVNPAYPayment = async () => {
    //     const { total } = this.state;

    //     // Gửi yêu cầu thanh toán VNPAY đến backend
    //     try {
    //         const response = await axios.post(`${Api}/vnpay_payment`, { total });
    //         window.location.href = response.data.data; // Chuyển hướng người dùng đến trang thanh toán VNPAY
    //     } catch (error) {
    //         console.error('Error initiating VNPAY payment:', error);
    //         alert('Đã xảy ra lỗi khi bắt đầu thanh toán VNPAY.');
    //     }
    // };
handleMomoPayment = async () => {
  const { name, phone, email, address, provinces, district, wards, checkoutList, total } = this.state;

  if (!name || !phone || !email || !address || !provinces || !district || !wards) {
      alert("Vui lòng điền đầy đủ thông tin thanh toán.");
      return;
  }

  if (checkoutList.length === 0) {
      alert("Giỏ hàng không có sản phẩm.");
      return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.id || null;

  const products = checkoutList.map(item => ({
    product_id: item.product_id || item.id,
    quantity: item.quantity,
    price: item.product?.price || 0,
  }));

  const orderData = {
    name,
    phone,
    email,
    address,
    provinces,
    district,
    wards,
    products,
    total_money: total,
    user_id,
  };

  try {
      const response = await axios.post('http://localhost:3000/payment', orderData);

      if (response.data && response.data.payUrl) {
        // Trước khi redirect sang MoMo, xóa giỏ hàng luôn như handlePayment
        const cartItems = checkoutList.map(item => item.id);
        for (const cartId of cartItems) {
          await this.deleteCartFromDatabase(cartId);
        }

        this.setState({ cartList: [] });
        localStorage.removeItem('checkoutList');
        localStorage.setItem('cartCount', '0');
        this.props.clearCart?.();

        alert("Thanh toán thành công và giỏ hàng đã được xóa.");

        // Redirect sang link MoMo
        window.location.href = response.data.payUrl;
      } else {
        alert("Không nhận được URL thanh toán MoMo.");
        console.error("Response MoMo:", response.data);
      }
  } catch (error) {
      console.error('Error initiating Momo payment:', error);
      alert('Đã xảy ra lỗi khi bắt đầu thanh toán Momo.');
  }
};



    render() {
        if (this.state.redirect) {
            return <Navigate to='/' />;
        }

        return (
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="billing-details">
                                    <div className="section-title">
                                        <h3 className="title">Thông tin thanh toán</h3>
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.name} type="text" name="name" placeholder="Họ và tên" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.phone} type="text" name="phone" placeholder="Số điện thoại" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.email} type="email" name="email" placeholder="Email" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.address} type="text" name="address" placeholder="Địa chỉ" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.provinces} type="text" name="provinces" placeholder="Tỉnh/Thành phố" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.district} type="text" name="district" placeholder="Quận/Huyện" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.wards} type="text" name="wards" placeholder="Phường/Xã" required />
                                    </div>
                                    <button className="btn" type="button" onClick={this.handlePayment}>Thanh toán bình thường</button>
                                    {/* <button className="btn" type="button" onClick={this.handleVNPAYPayment}>Thanh toán VNPAY</button> Nút thanh toán VNPAY */}
                                    <button className="btn" type="button" onClick={this.handleMomoPayment}>Thanh toán Momo</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-5">
                            <div className="order-details">
                                <h3 className="title">Chi tiết đơn hàng</h3>
                                <table className="shopping-cart-table table">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.checkoutList.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.product.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.product.price * item.quantity).toLocaleString()}₫</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="order-summary">
                                    <h4>Tổng cộng: {(this.state.total).toLocaleString()}₫</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUser: (user) => dispatch({ type: 'ADD_USER', payload: user }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
