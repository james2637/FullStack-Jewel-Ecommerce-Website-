import React, { useState } from "react";
import ProductItem from "./ProductItem";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${baseUrl}/api/product/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="border rounded px-3 py-1"
        />
        <button onClick={handleSearch} className="bg-pink-600 text-white px-4 py-1 rounded">
          Search
        </button>
      </div>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map(product => (
          <ProductItem
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;