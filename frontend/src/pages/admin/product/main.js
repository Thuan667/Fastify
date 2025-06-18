import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ListProduct from "./ListProduct";
import CreateProduct from "./CreateProduct";
import User from "./User";


const Main = () => (
  <main>
    <Routes>
    <Route path="products/edit/:id" element={<EditProduct />} />
    <Route path="/product" element={<ListProduct />} />
    <Route path="/users" element={<User/>}/>
    
    </Routes>
  </main>
);

export default Main;
