import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [BestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct);
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
          Our best-selling jewelry pieces are crafted with precision and care,
          ensuring the highest quality for our customers.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md-grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {BestSeller.map((item, index) => (
          <ProductItem
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
