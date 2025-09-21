import React, { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import Title from "../../components/Title";

const GoldEarringProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${baseUrl}/api/product/gold-earring`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col pt-10 border-t">
      <div className="flex justify-between text-base sm:text-2xl mb-4 px-4">
        <Title text1="GOLD" text2="EARRINGS" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 px-4">
        {products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          products.map((item, index) => (
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              key={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GoldEarringProducts;
