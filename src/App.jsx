import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GoldChainProducts from "./pages/gold/GoldChainProducts";
import GoldBraceletProducts from "./pages/gold/GoldBraceletProducts";
import GoldEarringProducts from "./pages/gold/GoldEarringProducts";
import GoldRingProducts from "./pages/gold/GoldRingProducts";
import GoldNoseringProducts from "./pages/gold/GoldNoseringProducts";
import SilverChainProducts from "./pages/silver/SilverChainProducts";
import SilverEarringProducts from "./pages/silver/SilverEarringProducts";
import SilverBraceletProducts from "./pages/silver/SilverBraceletProducts";
import SilverRingProducts from "./pages/silver/SilverRingProducts";
import SilverNoseringProducts from "./pages/silver/SilverNoseringProducts";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
// import Login from "./pages/Login";
import Account from "./pages/OtpAuthentication";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import Navbar2 from "./components/Navbar2";
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/gold-chain" element={<GoldChainProducts />} />
        <Route path="/gold-bracelet" element={<GoldBraceletProducts />} />
        <Route path="/gold-earring" element={<GoldEarringProducts />} />
        <Route path="/gold-ring" element={<GoldRingProducts />} />
        <Route path="/gold-nosering" element={<GoldNoseringProducts />} />
        <Route path="/silver-chain" element={<SilverChainProducts />} />
        <Route path="/silver-earring" element={<SilverEarringProducts />} />
        <Route path="/silver-bracelet" element={<SilverBraceletProducts />} />
        <Route path="/silver-ring" element={<SilverRingProducts />} />
        <Route path="/silver-nosering" element={<SilverNoseringProducts />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
