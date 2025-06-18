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
        refreshPage();

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post(`${Api}/users/login`, { email, password })
            .then(result => {
                console.log("Login success", result.data); 
                localStorage.setItem('token', result.data.jwt);
                props.addUser(result.data.user);
                setShow(false);
                setLoading(false);
                refreshPage();
            })
            .catch(error => {
                setError(true);
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
                        {error && (
                            <div className="form-alert">
                                <Alert variant='danger'>
                                  Sai mật khẩu hoặc email!
                                    <i className="fa fa-exclamation-triangle"></i>
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