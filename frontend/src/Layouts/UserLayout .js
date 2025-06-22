// src/Layouts/UserLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';
import Main from './Main';
import Banner from './Banner';
import QuickView from '../pages/home/QuickView';
import Sport from './Sport';
 

const UserLayout = () => {
    return (
        <div>
            <QuickView />
            <Header />
            <Banner />
            <Nav />
            <Sport />
            <Main />
            <Footer />
          
        </div>
    );
};

export default UserLayout;
