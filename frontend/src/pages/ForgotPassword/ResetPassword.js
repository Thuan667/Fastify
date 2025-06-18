import React, { useState } from 'react';
import axios from 'axios';
import { ip } from '../api/Api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, Form, Button } from 'react-bootstrap';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async e => {
    e.preventDefault();
    setSuccess(null);
    setError('');

    try {
      const res = await axios.post(`${ip}/reset-password`, {
        token,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.data.message) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setSuccess(false);
        setError('Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setError('Token không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh', background: '#f8f9fa' }}>
      <div className="p-4 shadow rounded" style={{ background: 'white', maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-4" style={{ color: '#dc3545' }}>🔐 Đặt lại mật khẩu</h4>

        {success === true && (
          <Alert variant="success" className="text-center">
            ✅ Mật khẩu đã được đặt lại thành công! Bạn sẽ được chuyển hướng...
          </Alert>
        )}

        {success === false && (
          <Alert variant="danger" className="text-center">
            ❌ {error}
          </Alert>
        )}

        {success === null && (
          <Form onSubmit={handleReset}>
            <Form.Group>
              <Form.Label className="text-muted">Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu mới..."
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={{
                  borderColor: '#dc3545',
                  borderWidth: '2px',
                  boxShadow: 'none'
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mt-3"
              style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
            >
              Đổi mật khẩu
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
