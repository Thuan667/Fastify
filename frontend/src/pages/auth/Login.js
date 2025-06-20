import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { Api } from '../api/Api';

function Login(props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleClose = () => {
        props.hideLogin();
        setShow(false);
    };
    

    const handleShow = () => {
        setShow(true);
    };

    const refreshPage = () => {
 window.location.reload();
    };

 const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false); // reset lỗi trước đó

    axios.post(`${Api}/users/login`, { email, password })
        .then(result => {
            const user = result.data.user;

            // Kiểm tra nếu tài khoản bị khóa nằm trong .then() (chỉ dùng khi backend trả HTTP 200)
            // Nếu backend không trả HTTP 200 thì bỏ đoạn này

            localStorage.setItem('token', result.data.jwt);
            props.addUser(user);
            setShow(false);
            setLoading(false);
            refreshPage();
        })
        .catch(error => {
            console.log("Login error:", error.response?.data); // Debug xem lỗi gì

            // Nếu backend trả mã lỗi trong response
            if (error.response) {
                const res = error.response.data;

                // Kiểm tra nếu là tài khoản bị khóa
                if (res.code === "LOCKED" || res.message?.toLowerCase().includes("khóa")) {
                    setError("locked");
                } else {
                    setError("invalid"); // Sai mật khẩu/email
                }
            } else {
                setError("invalid"); // Lỗi không xác định
            }

            setLoading(false);
        });
};



    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <React.Fragment>
            <Button onClick={handleShow} bsPrefix="auth" style={{ color: 'black' }}>
                <i className="fa fa-sign-in" style={{ color: 'black' }}></i> Đăng Nhập
            </Button>
            <Modal show={show || props.showLogin} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="auth-title">Đăng Nhập</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="auth" onSubmit={handleSubmit}>
                      {error === "invalid" && (
    <div className="form-alert">
        <Alert variant="danger">
            Sai mật khẩu hoặc email!
            <i className="fa fa-exclamation-triangle"></i>
        </Alert>
    </div>
)}

{error === "locked" && (
    <div className="form-alert">
        <Alert variant="warning">
            Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!
            <i className="fa fa-lock"></i>
        </Alert>
    </div>
)}

                        <div className="form-group">
                            <input
                                type="email"
                                required
                                className="form-control auth-input"
                                name="email"
                                placeholder="Nhập Email"
                                onChange={handleChange}
                            />
                            <i className="fa fa-user"></i>
</div>
                        <div className="form-group">
                            <input
                                type="password"
                                required
                                className="form-control auth-input"
                                name="password"
                                placeholder="Nhập Mật Khẩu"
                                onChange={handleChange}
                            />
                            <i className="fa fa-lock"></i>
                        </div>
                        <button type="submit" className="submit btn btn-danger">
                            {loading ? (
                                <div className="align-middle">
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                    <span>Đang đăng nhập...</span>
                                </div>
                            ) : (
                                <span>Đăng Nhập</span>
                            )}
                        </button>
                    </form>
                
                    <div className="mt-3" style={styles.forgotPassword}>
                        <a href="/forgot-password" style={styles.link}>Quên mật khẩu?</a>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

const styles = {
    forgotPassword: {
        textAlign: 'right',
    },
    link: {
        textDecoration: 'none', // Bỏ gạch chân
        color: '#007bff', // Màu xanh dương hoặc bạn có thể đổi màu
    }
};

const mapStateToProps = state => {
    return { showLogin: state.show_login };
};

const mapDispatchToProps = dispatch => {
    return {
        addUser: user => dispatch({ type: 'USER', value: user }),
        hideLogin: () => dispatch({ type: 'LOGIN_CONTROL', value: false })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);