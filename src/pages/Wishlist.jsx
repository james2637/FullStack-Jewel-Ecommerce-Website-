import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlistProducts, currency, removeFromWishlist, addToCart, token, navigate, getUserWishlist } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (token) {
        await getUserWishlist(token);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, [token]);

  const handleRemove = (itemId) => {
    removeFromWishlist(itemId);
  };

  const handleAddToCart = (productId, sizes) => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/account");
      return;
    }
    
    if (sizes && sizes.length > 0) {
      addToCart(productId, sizes[0]);
      toast.success("Added to cart");
    } else {
      toast.error("Product has no available sizes");
    }
  };

  const handleLogin = () => {
    navigate("/account");
  };

  if (loading) {
    return (
      <div className="border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-2xl mb-8">
        <h1 className="text-3xl font-semibold mb-2">MY WISHLIST</h1>
        {token && (
          <p className="text-sm text-gray-500">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {!token ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">Please login to view your wishlist</p>
          <button 
            onClick={handleLogin}
            className="bg-black text-white px-8 py-3 text-sm"
          >
            LOGIN
          </button>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/collection">
            <button className="bg-black text-white px-8 py-3 text-sm">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {wishlistProducts.map((product) => (
            <div key={product._id} className="relative group">
              {/* Remove button */}
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:text-white"
                title="Remove from wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <Link to={`/product/${product._id}`} className="block">
                <div className="overflow-hidden">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="hover:scale-110 transition ease-in-out w-full"
                  />
                </div>
                <p className="pt-3 pb-1 text-sm">{product.name}</p>
                <p className="text-sm font-medium">
                  {currency}{product.price}
                </p>
              </Link>

              {/* Add to cart button */}
              <button
                onClick={() => handleAddToCart(product._id, product.sizes)}
                className="w-full mt-2 bg-black text-white py-2 text-xs hover:bg-gray-800 transition"
              >
                ADD TO CART
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;