import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/order/myorders`, {
          headers: token ? { token } : {},
        });

        // backend may return list under res.data.orders or res.data.data
        const list = res.data.orders || res.data.data || res.data;
        if (mounted) setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (mounted) setError(err.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, [backendUrl, token]);

  const goToOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div className="border-t pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {loading && <div className="p-6">Loading your orders...</div>}
      {error && <div className="p-6 text-red-600">Error: {error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="p-6 text-gray-600">You have no orders yet.</div>
      )}

      <div className="space-y-4">
        {orders.map((order, index) => {
          const firstItem = (order.items && order.items[0]) || {};
          const totalQty = (order.items || []).reduce((s, it) => s + (it.quantity || 0), 0);
          const rawDate = order.createdAt || order.created_at || order.date || order.created;
          let date = "-";
          try {
            if (rawDate) {
              date = new Date(rawDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
            }
          } catch (e) {
            date = String(rawDate || "-");
          }

          const status = order.status || order.orderStatus || "Pending";
          const payment = order.paymentMethod || order.payment || (order.isCod ? "COD" : "Online");

          return (
            <div
              className="bg-white rounded-md shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              key={order._id || order.orderId || index}
            >
              <div className="flex items-start gap-4 text-sm">
                <div className="w-16 sm:w-20 h-16 sm:h-20 flex-shrink-0 overflow-hidden rounded">
                  <img src={firstItem.image || firstItem.images?.[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="sm:text-base font-medium">{firstItem.name || `Order ${order._id || order.orderId || index}`}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {order.amount || order.total || 0}
                    </p>
                    <p>Quantity: {totalQty}</p>
                  </div>
                  <p className="mt-1">Date: <span className="text-gray-500">{date}</span></p>
                  <p className="mt-1">Payment: <span className="text-gray-500">{payment}</span></p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`inline-block w-3 h-3 rounded-full ${status.toLowerCase().includes("delivered") ? "bg-green-500" : "bg-yellow-400"}`}></span>
                  <p className="text-sm md:text-base">{status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => goToOrder(order._id || order.orderId)} className="border px-4 py-2 text-sm rounded-sm">View</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
