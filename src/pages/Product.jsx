import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useState } from "react";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    token,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!token) {
      toast.error("Please login to continue");
      navigate("/account");
      return;
    }

    // Add to cart (size check is already in addToCart function)
    if(size){
      toast.success("Added to cart");
    }
    addToCart(productData._id, size);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please login to continue");
      navigate("/account");
      return;
    }

    if (wishlist.includes(productData._id)) {
      removeFromWishlist(productData._id);
    } else {
      addToWishlist(productData._id);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 px-4 sm:px-0 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                alt=""
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1 ">
          {/* Product name */}
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          {/* Product Rating */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          {/* Product Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          {/* Product desc */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          {/* Size */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-black" : ""
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* Add to cart and wishlist buttons */}
          {/* Add to cart and wishlist buttons */}
          <div className="flex gap-3">
            <button
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 flex-1"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
            <button
              className={`border px-6 mr-1 py-3 text-xl transition-colors relative group ${
                wishlist.includes(productData._id)
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-black border-black hover:bg-gray-50"
              }`}
              onClick={handleWishlist}
            >
              {wishlist.includes(productData._id) ? "♥" : "♡"}
              {/* Tooltip on hover */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {wishlist.includes(productData._id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"}
              </span>
            </button>
          </div>
          {/* Line */}
          <hr className="mt-8 sm:w-4/5" />
          {/* Guarantees */}
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and Review */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122) </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>
      {/* Related Products Section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
