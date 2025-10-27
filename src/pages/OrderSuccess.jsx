import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const params = useParams();
  const { backendUrl, token } = useContext(ShopContext);
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If no order passed via state but we have an orderId param, try to fetch it
    const fetchOrder = async (id) => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/order/${id}`, {
          headers: token ? { token } : {},
        });
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!order && params.orderId) {
      fetchOrder(params.orderId);
    }
  }, []);

  if (loading) return <div className="p-6">Loading order...</div>;

  if (!order)
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order placed</h2>
        <p>If you see this message, the order was placed but details are not available.
        You will receive an email / SMS shortly.</p>
      </div>
    );

  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="text-center mb-6 sm:mb-8 pt-4">
        <FaCheckCircle className="text-green-500 text-5xl sm:text-6xl mx-auto mb-3 sm:mb-4 animate-bounce" />
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 text-sm sm:text-base px-2">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm text-gray-600 uppercase">Order ID</h3>
            <p className="font-medium text-sm sm:text-base break-all">{order._id || order.orderId || order.id}</p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm text-gray-600 uppercase">Total Amount</h3>
            <p className="font-medium text-sm sm:text-base">₹{order.amount || order.total || order.orderAmount}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm text-gray-600 uppercase mb-2">Shipping Address</h3>
          {order.address && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded">
              <div className="font-medium text-sm sm:text-base">{order.address.firstName} {order.address.lastName}</div>
              <div className="text-gray-600 text-sm mt-1">{order.address.street}</div>
              <div className="text-gray-600 text-sm">{order.address.city}, {order.address.state} - {order.address.zipcode}</div>
              <div className="text-gray-600 text-sm">{order.address.country}</div>
              {order.address.phone && <div className="text-gray-600 text-sm mt-2">Phone: {order.address.phone}</div>}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-xs sm:text-sm text-gray-600 uppercase mb-3">Order Items</h3>
          <div className="space-y-3">
            {(order.items || []).map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                  <img 
                    src={it.image} 
                    alt={it.name} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{it.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Size: {it.size} • Qty: {it.quantity}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium text-sm sm:text-base">₹{it.price * it.quantity}</div>
                  <div className="text-xs sm:text-sm text-gray-600">₹{it.price} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 pb-6">
        <button 
          onClick={() => navigate('/collection')}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-black text-white text-sm sm:text-base rounded-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/orders')}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-black text-black text-sm sm:text-base rounded-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Go to My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
