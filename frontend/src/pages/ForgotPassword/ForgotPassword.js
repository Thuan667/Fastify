import React, { useState } from 'react';
import axios from 'axios';
import { ip } from '../api/Api';
import { Alert, Form, Button, Spinner } from 'react-bootstrap';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${ip}/forgot-password`, { email }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh', background: '#f8f9fa' }}>
      <div className="p-4 shadow rounded" style={{ background: 'white', maxWidth: '400px', width: '100%' }}>
        <h4 className="text-center mb-4" style={{ color: '#dc3545' }}>🔒 Quên mật khẩu</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className="text-muted">Nhập email của bạn</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                borderColor: '#dc3545',
                borderWidth: '2px',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 mt-3"
            style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : 'Gửi liên kết khôi phục'}
          </Button>
        </Form>

        {status === 'success' && (
          <Alert variant="success" className="mt-3 text-center">
            Link khôi phục mật khẩu đã được gửi về email của bạn!
          </Alert>
        )}
        {status === 'error' && (
          <Alert variant="danger" className="mt-3 text-center">
            Có lỗi xảy ra, vui lòng kiểm tra lại email.
          </Alert>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
