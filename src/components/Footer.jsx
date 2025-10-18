import React from "react";
import { assets } from "../assets/assets";
const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-10">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
          <b>RJ Golds</b> is a renowned jewellery business based in Kolkata, celebrated for our commitment to quality craftsmanship and reasonable pricing. With years of experience in the industry, we have become a trusted name for customers seeking authentic gold and silver jewellery that blends tradition with modern elegance.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="/">Home</a></li>
            <li><a href="/collection">Collection</a></li>
            <li><a href="/orders">My Orders</a></li>
            <li><a href="/cart">My Cart</a></li>
            <li><a href="/account">Login</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 0000000000</li>
            <li>rjgolds@gmail.com</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-md text-center">Copyright 2025 @ RJ Golds - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
