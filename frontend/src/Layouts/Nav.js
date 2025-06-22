// import React from 'react';
// import { NavLink } from 'react-router-dom';
// const Nav = () => (
//     <nav id="navigation">
//         <div className="container">
//             <div id="responsive-nav">
//                 <ul className="main-nav nav nav-navbar">
//                     <li>
//                         <NavLink to="/" activeClassName="active">Trang chủ</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/product" activeClassName="active">Sản phẩm</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/tin-tuc" activeClassName="active">Tin tức</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/lien-he" activeClassName="active">Liên hệ</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/phan-hoi" activeClassName="active">Phản hồi</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/thong-tin" activeClassName="active">Thông tin</NavLink>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     </nav>
// );

// export default Nav;
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
    <nav id="navigation">
        <div className="container">
            <div id="responsive-nav">
                <ul className="main-nav nav nav-navbar">
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/product">Sản phẩm</Link></li>
                    <li><Link to="/tin-tuc">Tin tức</Link></li>
                    <li><Link to="/bai-viet">Bài viết</Link></li>
                    <li><Link to="/phan-hoi">Phản hồi</Link></li>
                    {/* <li><Link to="/thong-tin">Thông tin</Link></li> */}
                </ul>
            </div>
        </div>
    </nav>
);

export default Nav;
