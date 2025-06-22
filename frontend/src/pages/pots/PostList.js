import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3000/api/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        toast.error("Không thể tải bài viết!");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="section">
      <ToastContainer />
      <div className="container">
        <div className="row">
          <h2 className="text-center mb-4">📝 Bài viết mới nhất</h2>
          {posts.length === 0 ? (
            <div className="col-12 text-center">
              <p>Không có bài viết nào để hiển thị.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div className="col-md-4 mb-4" key={post.id}>
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                  {post.image && (
                    <img
                      src={`http://localhost:3000/public/${post.image}`}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">
                      {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
                    </p>
                    {/* Nếu sau này có trang chi tiết */}
                    {/* <Link to={`/posts/${post.id}`} className="btn btn-outline-primary">Xem chi tiết</Link> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
