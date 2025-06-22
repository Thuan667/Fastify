import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { Api } from '../api/Api';

function Register(props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorKeys, setErrorKeys] = useState([]);
  const [error, setError] = useState({});
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setSuccessMessage('');
    setErrorKeys([]);
    setError({});
    setShow(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError({});
    setErrorKeys([]);

    if (name.trim().length < 3) {
      setError({ name: "Tên đăng nhập phải có ít nhất 3 ký tự." });
      setErrorKeys(["name"]);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError({ email: "Email không đúng định dạng." });
      setErrorKeys(["email"]);
      return;
    }

    if (password.length < 6) {
      setError({ password: "Mật khẩu phải có ít nhất 6 ký tự." });
      setErrorKeys(["password"]);
      return;
    }

    if (password !== passwordConfirm) {
      setError({ password_confirmation: "Mật khẩu xác nhận không trùng khớp." });
      setErrorKeys(["password_confirmation"]);
      return;
    }

    setLoading(true);

    axios.post(`${Api}/users`, {
      name,
      email,
      password,
      password_confirmation: passwordConfirm,
      address,
      phone,
      username,
      role: 'customer'
    })
      .then((result) => {
        setSuccessMessage('Đăng ký thành công!');
        setLoading(false);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data) {
          try {
            const parsedError = JSON.parse(err.response.data);
            setErrorKeys(Object.keys(parsedError));
            setError(parsedError);
          } catch (parseError) {
            setErrorKeys(['non_field_errors']);
            setError({ non_field_errors: 'Đã xảy ra lỗi ngoài ý muốn. Vui lòng thử lại sau.' });
          }
        } else {
          setErrorKeys(['general']);
          setError({ general: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
        }
      });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'password_confirmation') setPasswordConfirm(value);
    if (name === 'username') setUsername(value);
    if (name === 'address') setAddress(value);
    if (name === 'phone') setPhone(value);
  };

  return (
    <React.Fragment>
      <Button onClick={handleShow} bsPrefix="auth" style={{ color: 'black' }}>
        <i className="fa fa-user-o" style={{ color: 'black' }}></i> Đăng Ký
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="auth-title">Người Dùng Đăng Ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <Alert variant='success'>{successMessage}</Alert>}

          <form className="auth" onSubmit={handleSubmit}>
            {errorKeys.length > 0 && errorKeys.map((key) => (
              <div className="form-alert" key={key}>
                <Alert variant='danger'>
                  <i className="fa fa-exclamation-triangle"></i> {error[key]}
                </Alert>
              </div>
            ))}

            <div className="form-group">
              <input type="text" name="name" required className="form-control auth-input" placeholder="Nhập Tên Đăng Nhập" onChange={handleChange} />
              <i className="fa fa-user"></i>
              {error.name && (
                <small className="form-text text-muted">{error.name}</small>
              )}
            </div>

            <div className="form-group">
              <input type="email" name="email" required className="form-control auth-input" placeholder="Nhập Email" onChange={handleChange} />
              <i className="fa fa-envelope"></i>
              {error.email && (
                <small className="form-text text-muted">{error.email}</small>
              )}
            </div>

            <div className="form-group">
              <input type="password" name="password" required className="form-control auth-input" placeholder="Nhập Mật Khẩu" onChange={handleChange} />
              <i className="fa fa-lock"></i>
              {error.password && (
                <small className="form-text text-muted">{error.password}</small>
              )}
            </div>

            <div className="form-group">
              <input type="password" name="password_confirmation" required className="form-control auth-input" placeholder="Xác Nhận Mật Khẩu" onChange={handleChange} />
              <i className="fa fa-lock"></i>
              {error.password_confirmation && (
                <small className="form-text text-muted">{error.password_confirmation}</small>
              )}
            </div>

            <div className="form-group">
              <input type="text" name="username" required className="form-control auth-input" placeholder="Tên người dùng" onChange={handleChange} />
              <i className="fa fa-user"></i>
            </div>

            <div className="form-group">
              <input type="text" name="phone" className="form-control auth-input" placeholder="Số điện thoại" onChange={handleChange} />
              <i className="fa fa-phone "></i>
            </div>

            <div className="form-group">
              <input type="text" name="address" className="form-control auth-input" placeholder="Địa chỉ" onChange={handleChange} />
              <i className="fa fa-map-marker"></i>
            </div>

            <button type="submit" className="submit btn btn-danger">
              {loading ? (
                <div className="align-middle">
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  <span>Đang Đăng Ký...</span>
                </div>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: (user) => dispatch({ type: 'USER', value: user })
  };
};

export default connect(null, mapDispatchToProps)(Register);
