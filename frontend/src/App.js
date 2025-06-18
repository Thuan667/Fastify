

import "./assets/sass/app.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Layouts/Main";
import QuickView from "./pages/home/QuickView";
import Admin from "./pages/admin/Dashboard"; // Component Admin cần tạo
import UserLayout from "./Layouts/UserLayout "; // Layout cho người dùng
import AdminLayout from "./Layouts/AdminLayout"; // Layout cho admin
import ProductPage from "./pages/products/ProductPage";
import Wishlist from "./pages/home/Wishlist";
import ShoppingCart from "./pages/home/ShoppingCart";
import Checkout from "./pages/home/Checkout";
import ProductDetail from "./pages/products/ProductDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import ListProduct from "./pages/admin/product/ListProduct";
// import ListCategory from "./pages/admin/product/ListCategory";
 import EditProduct from "./pages/admin/product/EditProduct"; 
 import Index from "./pages/Delivery/index";
import UserProfile from "./pages/user/UserProfile";
import SearchResults from "./pages/home/SearchResults";
// import Pay from "./pages/home/Pay";
import CheckoutVnpay from "./pages/home/CheckoutVnpay";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import Myaccount from "./pages/home/myaccount";
import FeedbackPage from "./pages/phanHoi/FeedbackPage";
import News from "./pages/tinTuc/News";
import ContactForm from "./pages/lienHe/ContactForm";
import ProfilePage from "./pages/thongTin/ProfilePage";

function App() {
  return (

    <Routes>
    <Route path="/admin/*" element={<AdminLayout />}>
      <Route index element={<Admin />} />  
      <Route path="products/edit/:id" element={<EditProduct />} />

    </Route>

      <Route path="/" element={<UserLayout />}>
      <Route  path="/track-oder" element={<Index/>} />
      <Route  path="/my-account" element={<UserProfile/>} />
        <Route index element={<QuickView />} />
        <Route path="main" element={<Main />} />
        <Route path="product" element={<ProductPage />} /> {/* Thêm Route cho /product */}
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="shopping-cart" element={<ShoppingCart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="products/:productId" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} /> 
        <Route path="checkout-vnpay" element={<CheckoutVnpay />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-account" element={<Myaccount />} />
        <Route  path="/phan-hoi" element={<FeedbackPage />} />
          <Route  path="/tin-tuc" element={<News />} />
      <Route  path="/lien-he" element={<ContactForm />} />
            <Route path="thong-tin" element={<ProfilePage/>} />
      
      </Route>


    </Routes>

  );
}

export default App;



/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./index');
