import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { FaCheck } from "react-icons/fa";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrder = async () => {
      try {
        // Prefer context token but fallback to localStorage to avoid race on page reload
        const authToken = token || localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/api/order/order-details/${orderId}`, {
          headers: authToken ? { token: authToken } : {},
        });
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          throw new Error(res.data.message || "Failed to fetch order");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Could not load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, backendUrl, token]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Error loading order</h3>
              <p className="text-red-700 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 text-red-800 hover:text-red-600 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Not Found</h3>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you may not have permission to view it.</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch (e) {
      return "-";
    }
  };

  // Calculate tracking steps based on status
  const getTrackingSteps = () => {
    const steps = [
      { label: "Order Placed", date: formatDate(order.date) },
      { label: "Packing", date: order.status === "Packing" ? "In Progress" : "-" },
      { label: "Shipped", date: order.status === "Shipped" ? "On the way" : "-" },
      { label: "Out for Delivery", date: order.status === "Out for Delivery" ? "Today" : "-" },
      { label: "Delivered", date: order.status === "Delivered" ? formatDate(order.deliveredAt) : "-" }
    ];

    const statusIndex = steps.findIndex(step => step.label === order.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex
    }));
  };

  const trackingSteps = getTrackingSteps();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><span className="text-gray-600">Order ID:</span> {order._id}</p>
              <p><span className="text-gray-600">Order Date:</span> {formatDate(order.date)}</p>
              <p>
                <span className="text-gray-600">Total Amount:</span> {currency}
                {order.amount}
              </p>
              <p><span className="text-gray-600">Payment Method:</span> {order.paymentMethod}</p>
              <p><span className="text-gray-600">Status:</span> {order.status}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p className="font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.zipcode}
              </p>
              <p>{order.address.country}</p>
              <p className="mt-2">Phone: {order.address.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border rounded-md"
            >
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {currency}
                  {item.price * item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  {currency}
                  {item.price} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Order Status</h2>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-[19px] top-[30px] bottom-4 w-px bg-gray-200"></div>
          
          {/* Steps */}
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.completed 
                    ? "bg-green-500 border-green-500" 
                    : "border-gray-300 bg-white"
                }`}>
                  {step.completed && <FaCheck className="text-white" />}
                </div>
                <div>
                  <p className={`font-medium ${step.completed ? "text-green-600" : "text-gray-600"}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;