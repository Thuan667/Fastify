import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Api } from '../../api/Api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [searchUser, setSearchUser] = useState('');
  const [filterStar, setFilterStar] = useState('all');

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get(`${Api}/admin/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText('');
  };

  const closeModal = () => {
    setSelectedReview(null);
    setReplyText('');
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`${Api}/admin/reviews/${selectedReview.id}/reply`, {
        reply: replyText,
      });
      alert('✅ Đã gửi phản hồi!');
      closeModal();
      fetchAllReviews();
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('❌ Lỗi khi gửi phản hồi');
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchStar = filterStar === 'all' || review.rating === parseInt(filterStar);
    const matchUser = review.username.toLowerCase().includes(searchUser.toLowerCase());
    return matchStar && matchUser;
  });

  if (loading) return <p>Đang tải đánh giá...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Quản lý đánh giá</h2>

      {/* Bộ lọc */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={filterStar}
            onChange={(e) => setFilterStar(e.target.value)}
          >
            <option value="all">Tất cả sao</option>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên người dùng..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </Col>
      </Row>

      {/* Danh sách đánh giá */}
      {filteredReviews.length === 0 ? (
        <p>Không tìm thấy đánh giá phù hợp.</p>
      ) : (
        filteredReviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px',
              background: '#fdfdfd',
            }}
          >
            <p><strong>Sản phẩm:</strong> {review.product_id}</p>
            <p><strong>Người dùng:</strong> {review.username}</p>
            <p><strong>Đánh giá:</strong> ⭐ {review.rating}</p>
            <p><strong>Bình luận:</strong> {review.comment}</p>
            <p><small>⏱ {new Date(review.created_at).toLocaleString()}</small></p>

            {review.admin_reply ? (
              <div style={{ background: '#e9f7ef', padding: '10px', marginTop: '10px' }}>
                <p><strong>👮 Phản hồi Admin:</strong> {review.admin_reply}</p>
                <p><small>🕒 {new Date(review.admin_reply_time).toLocaleString()}</small></p>
              </div>
            ) : (
              <Button variant="danger" size="sm" onClick={() => openReplyModal(review)}>
                Phản hồi
              </Button>
            )}
          </div>
        ))
      )}

      {/* Modal phản hồi */}
      <Modal show={!!selectedReview} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>📝 Phản hồi đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Người dùng:</strong> {selectedReview?.username}</p>
          <p><strong>Bình luận:</strong> {selectedReview?.comment}</p>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Nhập phản hồi..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleReply}>
            Gửi phản hồi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminReviews;
