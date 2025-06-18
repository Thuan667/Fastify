import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Table, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { Spinner } from 'react-bootstrap';


const Pay = () => {


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const [editModalShow, setEditModalShow] = useState(false);
    const [isLocationSelected, setIsLocationSelected] = useState(false); // Trạng thái chọn địa phương





    //abate
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [products, setProducts] = useState([]);
    const [totalMoney, setTotalMoney] = useState(0);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    //const [commune, setCommune] = useState([]);
    const [address, setAddress] = useState("");
    //const [totalAmount, setTotalAmount] = useState(0);
    const fee = 40000; // Đặt phí cố định

    // Style cho overlay
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền mờ
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // Đảm bảo nó nằm trên cùng
    };

    function handleChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case "name":
                setName(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "totalMoney":
                setTotalMoney(value);
                break;
            case "provinces":
                setProvince(value);
                break;
            case "district":
                setDistrict(value);
                break;
            case "wards":
                setWard(value);
                break;
            case "address":
                setAddress(value);
                break;
            default:
                break;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Giải mã token từ localStorage để lấy userId
        const token = localStorage.getItem('token');

        // Tạo mảng products từ selectedItems
        const products = selectedItems.map(item => ({
            id: item.id,
            name: item.name,
            photo: item.photo,
            quantity: item.quantity,
            price: item.price * item.quantity,
        }));

        // Log dữ liệu trước khi gửi để kiểm tra
        console.log({
            name: name,
            phone: phone,
            email: email,
            products: products,
            totalMoney: totalMoney,
            provinces: province,
            district: district,
            wards: ward,
            address: address
        });



        // Gửi yêu cầu POST để tạo đơn hàng
        axios.post("http://192.168.1.20:8000/api/abate", {
            name: name,
            phone: phone,

            email: email,
            products: products, // Chuyển mảng products thành JSON
            totalMoney: totalMoney,
            provinces: province,
            district: district,
            wards: ward,
            address: address
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            
    }

    //
    function handleSubmitVNpay(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Tạo mảng products từ selectedItems
        const products = selectedItems.map(item => ({
            id: item.id,
            name: item.name,
            photo: item.photo,
            quantity: item.quantity,
            price: item.price * item.quantity,
        }));

        // Log dữ liệu trước khi gửi để kiểm tra
        console.log({
            name: name,
            phone: phone,
            email: email,
            products: products,
            totalMoney: totalMoney,
            provinces: province,
            district: district,
            wards: ward,
            address: address
        });



        // Gửi yêu cầu POST để tạo đơn hàng
        axios.post("http://192.168.1.20:8000/api/abate", {
            name: name,
            phone: phone,
            email: email,
            products: products, // Chuyển mảng products thành JSON
            totalMoney: totalMoney,
            provinces: province,
            district: district,
            wards: ward,
            address: address
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {


                // Xóa các sản phẩm đã đặt khỏi giỏ hàng sau khi đặt hàng thành công
                const deleteRequests = products.map(product =>
                    axios.delete(`http://192.168.1.20:8000/api/product/cart-list/${product.id}`)
                );

                // Đợi tất cả các yêu cầu xóa hoàn tất
                Promise.all(deleteRequests)
                    .then(() => {
                        console.log('Các sản phẩm đã được xóa khỏi giỏ hàng');

                    })
                    .catch((err) => {
                        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", err);
                        // Điều hướng về trang chủ ngay cả khi xảy ra lỗi xóa sản phẩm
                        //navigate("/");
                    });
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    console.error("Lỗi 422: Dữ liệu không hợp lệ", err.response.data); // Kiểm tra lỗi cụ thể từ server
                    setErrorMessage("Lỗi 422: Dữ liệu không hợp lệ");
                } else {
                    setErrorMessage("Lỗi không đặt hàng thành công");
                }
            });
    }




    

    const handleVnPay = (e) => {
        e.preventDefault(); // Ngăn chặn hành động gửi form mặc định

        // Gọi hàm handleSubmit để xử lý logic đặt hàng
        handleSubmitVNpay(e); // Gọi handleSubmit với sự kiện e
        setEditModalShow(true);

    };

    const closeEditModal = () => {
        setEditModalShow(false);

    };




    const isShowComplete = () => {
        return selectedProvince !== ''; // Kiểm tra xem có tỉnh nào được chọn hay không
    };

    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };
    // Hàm để tính tổng số tiền
    const calculateTotalAmount = () => {
        const total = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        //setTotalAmount(total);
    };

    // Sử dụng useEffect để tự động tính tổng số tiền khi sản phẩm thay đổi
    useEffect(() => {
        calculateTotalAmount(); // Tính toán lại totalAmount
    }, [products]);

    // Sử dụng useEffect để tính tổng tiền
    useEffect(() => {
        setTotalMoney(isShowComplete() ? totalAmount + fee : totalAmount); // Cập nhật totalMoney
    }, [totalAmount, isShowComplete]);

    const formatCurrency = (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(() => {
        // Lấy danh sách tỉnh thành
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        // Lấy danh sách quận huyện khi tỉnh thành được chọn
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(response.data.data);

                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };

            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        // Lấy danh sách phường xã khi quận huyện được chọn
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(response.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };

            fetchWards();
        }
    }, [selectedDistrict]);

    return (
        <>
            <Form className="abate" >
                <div className="Pay container">
                    {isLoading && (
                        <div style={overlayStyle}>
                            <Spinner animation="border" variant="light" /> {/* Loading spinner */}
                        </div>
                    )}
                    <div className=" row">
                        <div className="col-8">
                            <div className="main-header">
                                <img className="logo" style={{ width: "300px", paddingTop: "10px", display: "block", margin: "0 auto" }} src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/checkout_logo.png?1726452627090" />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Thông tin người nhận</b>
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" name="email" className="form-control" onChange={handleChange}

                                            placeholder="Nhập email" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="name" name="name" className="form-control" onChange={handleChange}

                                            placeholder="Nhập Họ Tên" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="phone" name="phone" className="form-control" onChange={handleChange}

                                            placeholder="Số điện thoại" />
                                    </div>

                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedProvince(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedProvinceObj = provinces.find(prov => prov.id === selectedId);
                                                if (selectedProvinceObj) {
                                                    setProvince(selectedProvinceObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setProvince(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Tỉnh, Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>{province.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedDistrict}
                                            //onChange={(e) => setSelectedDistrict(e.target.value)}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedDistrict(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedDistrictObj = districts.find(prov => prov.id === selectedId);
                                                if (selectedDistrictObj) {
                                                    setDistrict(selectedDistrictObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setDistrict(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Quận, Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedWard}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedWard(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên phường xã tương ứng với ID đã chọn
                                                const selectedWardObj = wards.find(ward => ward.id === selectedId);
                                                if (selectedWardObj) {
                                                    setWard(selectedWardObj.name); // Lưu tên phường/xã
                                                } else {
                                                    setWard(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Phường, Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>{ward.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <textarea rows="4" name="address" onChange={handleChange} className="form-control" placeholder="Nhập địa chỉ cần giao..." />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Vận chuyển</b>
                                    </div>
                                    {isShowComplete() ?
                                        (
                                            <div className="ship-cod form-control">
                                                <div className="ship">
                                                    <input type="radio" checked readOnly />
                                                    Giao hàng tận nơi
                                                </div>
                                                <span className="cod">{formatCurrency(fee)}</span>
                                            </div>
                                        )
                                        :
                                        (
                                            <span className="null form-control">Vui lòng nhập thông tin giao hàng</span>
                                        )
                                    }
                                    <div className=" my-3">
                                        <b>Thanh toán</b>
                                    </div>
                                    <div className="method ">
                                        <div className="method-cash form-control">
                                            <div className="cash">
                                                {/* <input type="radio" id="cash" name="fav_language" /> */}
                                                <label >Thanh toán tiền mặt</label>
                                            </div>
                                            <div className="icon">
                                                <img style={{width:"16px", height:"16px"}} src="https://static.vecteezy.com/system/resources/previews/019/053/701/original/money-symbol-icon-png.png"/>
                                            </div>
                                        </div>
                                        <div className="method-transfer mt-2 form-control">
                                            <div className="transfer">
                                                {/* <input type="radio" id="transfer" name="fav_language" /> */}
                                                <p >Thanh toán VnPay</p>
                                            </div>
                                            <div >
                                                {/* <SiCashapp /> */}
                                                <img src="https://bizweb.dktcdn.net/100/480/632/themes/900313/assets/payment_3.svg?1712897547805"/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-4  " style={{ height: "730px", width: "400px", borderLeft: "3px solid lightgray" }} >
                            <div className="order container">

                                <div className="container">
                                    <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>Thông tin thanh toán</p>
                                    <div className="order-summary">
                                        <p>Sản phẩm đã chọn:</p>
                                        {selectedItems.length === 0 ? (
                                            <p>Không có sản phẩm nào được chọn.</p>
                                        ) : (
                                            <ul>
                                                {selectedItems.map((item, index) => (
                                                    <React.Fragment key={`${item.id}-${index}`}>
                                                        <hr />
                                                        <li className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                {/* Hiển thị hình ảnh sản phẩm */}
                                                                <img
                                                                    src={`../../../img/${item.photo}`}
                                                                    alt={item.name}
                                                                    style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                                />
                                                                <div>
                                                                    <span style={{ fontWeight: "bold", width: "200px" }}>{item.name}</span><br />
                                                                    <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                        Số lượng: {item.quantity}
                                                                    </span><br />
                                                                </div>
                                                            </div>
                                                            <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                {formatCurrency(item.price)}
                                                            </span>
                                                        </li>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <p>Tạm tính:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {formatCurrency(totalAmount)} {/* Hiển thị tạm tính */}
                                            </strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Phí vận chuyển: </p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {isShowComplete() ?
                                                    (
                                                        <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(fee)}</strong>
                                                    )
                                                    :
                                                    (
                                                        <span>---</span>
                                                    )
                                                }
                                            </strong>
                                        </div>
                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <p>Tổng tiền:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px",color:"red" }}>
                                                {formatCurrency(totalMoney)} {/* Hiển thị tổng tiền */}
                                            </strong>
                                        </div>
                                        <button onClick={handleSubmit} className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }}>Thanh toán bằng tiền mặt</button>

                                        <div>
                                            <form id="vnpayForm" action="http://192.168.1.20:8000/api/vnpay_payment" method="POST" onClick={handleVnPay}>
                                                <input type="hidden" name="total" value={totalMoney} />
                                                <button className="form-control" style={{ marginTop: "10px", backgroundColor: "white", color: "SlateBlue",borderColor:"SlateBlue" }} name="redirect" >Thanh toán bằng VNPAY</button>
                                            </form>
                                        </div>
                                        <Modal show={editModalShow} onHide={closeEditModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Xác nhận thanh toán</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="mb-3">
                                                    <label htmlFor="editName" className="form-label">Xác nhận thanh toán</label>

                                                </div>

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <form action="http://192.168.1.20:8000/api/vnpay_payment" method="POST" name="redirect">
                                                    <input type="hidden" name="total" value={totalMoney} />
                                                    <button className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }} name="redirect" >Xác nhận</button>
                                                </form>
                                            </Modal.Footer>
                                        </Modal>


                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Form>

        </>
    );
}
export default Pay;