import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle, FaShoppingCart, FaCreditCard } from 'react-icons/fa';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || "Payment was not completed";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="mb-6">
            <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h2>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Don't worry! No payment has been processed.
              Your cart items are safe and you can try again.
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Need help? Contact our support team at support@rjgolds.com
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/place-order")}
            className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaCreditCard className="text-lg" />
            Try Payment Again
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex-1 border-2 border-black text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="text-lg" />
            Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;