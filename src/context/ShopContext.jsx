import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const addToWishlist = async (itemId) => {
    let wishlistData = [...wishlist];
    if (!wishlistData.includes(itemId)) {
      wishlistData.push(itemId);
    }
    setWishlist(wishlistData);
    
    // Also add to wishlistProducts if not already there
    if (token) {
      const product = products.find(p => p._id === itemId);
      if (product && !wishlistProducts.find(p => p._id === itemId)) {
        setWishlistProducts([...wishlistProducts, product]);
      }
    }
    
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/wishlist/add",
          { itemId },
          { headers: { token } }
        );
        toast.success("Added to wishlist");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const removeFromWishlist = async (itemId) => {
    let wishlistData = wishlist.filter(id => id !== itemId);
    setWishlist(wishlistData);
    
    // Also remove from wishlistProducts
    setWishlistProducts(wishlistProducts.filter(product => product._id !== itemId));
    
    try {
      await axios.post(
        backendUrl + "/api/wishlist/remove",
        { itemId },
        { headers: { token } }
      );
      toast.success("Removed from wishlist");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserWishlist = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setWishlist(response.data.wishlist);
        setWishlistProducts(response.data.products || []);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    try {
      await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token } }
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
      getUserWishlist(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    getUserCart,
    wishlist,
    wishlistProducts,
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;