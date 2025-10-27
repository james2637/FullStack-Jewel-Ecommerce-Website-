import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const CodOrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { backendUrl, token, setCartItems, getUserCart } = useContext(ShopContext);
  
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate("/cart");
    return null;
  }

  const placeOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/payment/create-cash-order`,
        orderDetails,
        { headers: token ? { token } : {} }
      );

      if (response.data.success) {
        // Clear cart and refresh cart data from server
        setCartItems({});
        if (token) {
          await getUserCart(token);
        }

        // Navigate to success page
        const returnedOrderId = response.data.orderId || (response.data.order && response.data.order._id);
        if (returnedOrderId) {
          navigate(`/order-success/${returnedOrderId}`, { 
            state: { order: response.data.order || orderDetails }
          });
        } else {
          navigate("/order-success", { 
            state: { order: orderDetails }
          });
        }
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="text-center mb-6 sm:mb-8 pt-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Confirm Your Order</h2>
        <p className="text-gray-600 text-sm sm:text-base px-2">
          Please review your order details before confirming
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm text-gray-600 uppercase mb-2">Order Summary</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded">
            <div className="text-sm sm:text-base">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{orderDetails.amount - 99}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>COD Handling Fee:</span>
                <span>₹99</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                <span>Total Amount:</span>
                <span>₹{orderDetails.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm text-gray-600 uppercase mb-2">Shipping Address</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded">
            <div className="font-medium text-sm sm:text-base">
              {orderDetails.address.firstName} {orderDetails.address.lastName}
            </div>
            <div className="text-gray-600 text-sm mt-1">{orderDetails.address.street}</div>
            <div className="text-gray-600 text-sm">
              {orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.zipcode}
            </div>
            <div className="text-gray-600 text-sm">{orderDetails.address.country}</div>
            <div className="text-gray-600 text-sm mt-2">Phone: {orderDetails.address.phone}</div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-xs sm:text-sm text-gray-600 uppercase mb-3">Order Items</h3>
          <div className="space-y-3">
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Size: {item.size} • Qty: {item.quantity}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium text-sm sm:text-base">₹{item.price * item.quantity}</div>
                  <div className="text-xs sm:text-sm text-gray-600">₹{item.price} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-black text-black text-sm sm:text-base rounded-lg hover:bg-gray-100 transition-all"
        >
          Back
        </button>
        <button 
          onClick={placeOrder}
          disabled={loading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-black text-white text-sm sm:text-base rounded-lg hover:bg-gray-800 transition-all disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CodOrderConfirmation;