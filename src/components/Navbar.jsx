import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const promoOffers = [
  "Enjoy Flat 5% Cashback On Your Order!",
  "Free Shipping On Orders Above $99!",
  "Get 10% Off On Your First Purchase!",
  "Limited Time: Buy 1 Get 1 On Silver Rings!",
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoOffers.length);
    }, 4000); // Change offer every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };
  return (
    <>
      {/* Animated Promotional Bar */}
      <div className="w-full bg-pink-100 text-center py-2 text-black text-sm font-medium overflow-hidden h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={promoIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="block"
          >
            {promoOffers[promoIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex items-center justify-between py-5 font-medium">
        <Link to="/">
          <img src={assets.logo} alt="" className="w-36" />
        </Link>
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:underline underline-offset-4">
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          {/* Gold Dropdown */}
          <div className="relative group">
            <button className="flex flex-col items-center gap-1 hover:underline underline-offset-4">
              <p>GOLD</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-yellow-600 hidden" />
            </button>
            <div className="absolute left-0 top-full min-w-[160px] bg-white shadow-lg rounded z-10 hidden group-hover:block">
              <NavLink to="/gold-chain" className="block px-4 py-2 hover:bg-yellow-50 hover:underline underline-offset-4">Gold Chain</NavLink>
              <NavLink to="/gold-bracelet" className="block px-4 py-2 hover:bg-yellow-50 hover:underline underline-offset-4">Gold Bracelet</NavLink>
              <NavLink to="/gold-ring" className="block px-4 py-2 hover:bg-yellow-50 hover:underline underline-offset-4">Gold Ring</NavLink>
              <NavLink to="/gold-earring" className="block px-4 py-2 hover:bg-yellow-50 hover:underline underline-offset-4">Gold Earring</NavLink>
              <NavLink to="/gold-nosering" className="block px-4 py-2 hover:bg-yellow-50 hover:underline underline-offset-4">Gold Nose Ring</NavLink>
            </div>
          </div>

          {/* Silver Dropdown */}
          <div className="relative group">
            <button className="flex flex-col items-center gap-1 hover:underline underline-offset-4">
              <p>SILVER</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-400 hidden" />
            </button>
            <div className="absolute left-0 top-full min-w-[160px] bg-white shadow-lg rounded z-10 hidden group-hover:block">
              <NavLink to="/silver-chain" className="block px-4 py-2 hover:bg-gray-50 hover:underline underline-offset-4">Silver Chain</NavLink>
              <NavLink to="/silver-bracelet" className="block px-4 py-2 hover:bg-gray-50 hover:underline underline-offset-4">Silver Bracelet</NavLink>
              <NavLink to="/silver-ring" className="block px-4 py-2 hover:bg-gray-50 hover:underline underline-offset-4">Silver Ring</NavLink>
              <NavLink to="/silver-earring" className="block px-4 py-2 hover:bg-gray-50 hover:underline underline-offset-4">Silver Earring</NavLink>
              <NavLink to="/silver-nosering" className="block px-4 py-2 hover:bg-gray-50 hover:underline underline-offset-4">Silver Nose Ring</NavLink>
            </div>
          </div>

          <NavLink to="/about" className="flex flex-col items-center gap-1 hover:underline underline-offset-4">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:underline underline-offset-4">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        {/* Search Bar (Desktop) */}
        <div className="hidden sm:flex items-center ml-6">
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded px-14 py-1 text-sm focus:outline-none"
          />
          <button
            className="ml-2 px-3 py-1 bg-gray-700 text-white rounded"
            onClick={() => setShowSearch(true)}
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Wishlist Icon with label on hover */}
          <div className="relative group flex items-center">
            <Link to="/wishlist">
              <img
                src={assets.wishlist_icon}
                alt="Wishlist"
                className="w-6 cursor-pointer"
              />
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              Wishlist
            </span>
          </div>
          {/* Profile Icon with label on hover */}
          <div className="relative group flex items-center">
            <img
              src={assets.profile_icon}
              alt=""
              onClick={() => (token ? null : navigate("/login"))}
              className="w-5 cursor-pointer"
            />
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              Profile
            </span>
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => navigate("/login")}
                  >
                    My Profile
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => navigate("/orders")}
                  >
                    Orders
                  </p>
                  <p className="cursor-pointer hover:text-black" onClick={logout}>
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Cart Icon with label on hover */}
          <div className="relative group flex items-center">
            <Link to="/cart" className="relative">
              <img src={assets.cart_icon} alt="" className="w-5 min-w-5" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              Cart
            </span>
          </div>
          {/* Store Icon with label on hover */}
          <div className="relative group flex items-center">
            <Link to="/store">
              <img
                src={assets.store_icon}
                alt="Store"
                className="w-6 min-w-5"
              />
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              Store
            </span>
          </div>
          <img
            src={assets.menu_icon}
            alt=""
            className="w-5 cursor-pointer sm:hidden"
            onClick={() => setVisible(true)}
          />
        </div>

        {/* Sidebar menu for small screens */}
        <div
          className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              className="flex items-center gap-4 p-3 cursor-pointer"
              onClick={() => setVisible(false)}
            >
              <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
              <p>Back</p>
            </div>
            <NavLink
              to="/collection"
              className="py-2 pl-6 border"
              onClick={() => setVisible(false)}
            >
              COLLECTION
            </NavLink>
            {/* Gold Dropdown (Mobile) */}
            <details>
              <summary className="py-2 pl-6 border cursor-pointer">GOLD</summary>
              <div className="flex flex-col pl-10">
                <NavLink to="/gold-chain" className="py-1" onClick={() => setVisible(false)}>Gold Chain</NavLink>
                <NavLink to="/gold-bracelet" className="py-1" onClick={() => setVisible(false)}>Gold Bracelet</NavLink>
                <NavLink to="/gold-ring" className="py-1" onClick={() => setVisible(false)}>Gold Ring</NavLink>
                <NavLink to="/gold-earring" className="py-1" onClick={() => setVisible(false)}>Gold Earring</NavLink>
                <NavLink to="/gold-all" className="py-1" onClick={() => setVisible(false)}>All Gold</NavLink>
              </div>
            </details>
            {/* Silver Dropdown (Mobile) */}
            <details>
              <summary className="py-2 pl-6 border cursor-pointer">SILVER</summary>
              <div className="flex flex-col pl-10">
                <NavLink to="/silver-chain" className="py-1" onClick={() => setVisible(false)}>Silver Chain</NavLink>
                <NavLink to="/silver-bracelet" className="py-1" onClick={() => setVisible(false)}>Silver Bracelet</NavLink>
                <NavLink to="/silver-ring" className="py-1" onClick={() => setVisible(false)}>Silver Ring</NavLink>
                <NavLink to="/silver-earring" className="py-1" onClick={() => setVisible(false)}>Silver Earring</NavLink>
                <NavLink to="/silver-all" className="py-1" onClick={() => setVisible(false)}>All Silver</NavLink>
              </div>
            </details>
            <NavLink
              to="/about"
              className="py-2 pl-6 border"
              onClick={() => setVisible(false)}
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              className="py-2 pl-6 border"
              onClick={() => setVisible(false)}
            >
              CONTACT
            </NavLink>
            <NavLink
              to="/admin-panel"
              className="py-2 pl-6 border"
              onClick={() => setVisible(false)}
            >
              ADMIN PANEL
            </NavLink>
            {/* Search Bar (Mobile) */}
            <div className="px-6 py-2">
              <input
                type="text"
                placeholder="Search products..."
                className="border rounded px-3 py-1 w-full text-sm focus:outline-none"
              />
              <button
                className="mt-2 w-full px-3 py-1 bg-gray-700 text-white rounded"
                onClick={() => setShowSearch(true)}
              >
                Search
              </button>
            </div>
            {/* Store Link (Mobile) */}
            <NavLink
              to="/store"
              className="py-2 pl-6 border"
              onClick={() => setVisible(false)}
            >
              STORE
            </NavLink>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Navbar;
