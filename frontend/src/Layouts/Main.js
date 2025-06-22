import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Layouts/Home"; // Adjust the path if needed
import Collections from "../pages/home/Collections"; // Ensure the path is correct
import ProductPage from "../pages/products/ProductPage";
import ShoppingCart from "../pages/home/ShoppingCart";
import Wishlist from "../pages/home/Wishlist";
 import Checkout from "../pages/home/Checkout";
import ProductDetail from "../pages/products/ProductDetail";
import News from "../pages/tinTuc/News";
import ContactForm from "../pages/lienHe/ContactForm";
import FeedbackPage from "../pages/phanHoi/FeedbackPage";
import ProfilePage from "../pages/thongTin/ProfilePage";
import SearchResults from "../pages/home/SearchResults";
import Index from "../pages/Delivery/index";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import Myaccount from "../pages/home/myaccount";
import PostList from "../pages/pots/PostList";



const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route  path="/tin-tuc" element={<News />} />
      <Route  path="/lien-he" element={<ContactForm />} />
      <Route  path="/phan-hoi" element={<FeedbackPage />} />
      <Route path="thong-tin" element={<ProfilePage/>} />
      <Route path="/search" element={<SearchResults />} /> 
      <Route path="/track-oder" element={<Index/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/my-account" element={<Myaccount />} />
      <Route  path="/bai-viet" element={<PostList />} />
    </Routes>
  </main>
);

export default Main;
