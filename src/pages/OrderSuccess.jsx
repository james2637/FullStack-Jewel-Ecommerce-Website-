import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const OrderSuccess = () => {
  const location = useLocation();
  const params = useParams();
  const { backendUrl, token } = useContext(ShopContext);
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
      <p className="mb-2">Order ID: <span className="font-medium">{order._id || order.orderId || order.id}</span></p>
      <p className="mb-4">Amount: <span className="font-medium">{order.amount || order.total || order.orderAmount}</span></p>

      <div className="mb-4">
        <h3 className="font-semibold">Shipping Address</h3>
        <div>
          {order.address && (
            <div>
              <div>{order.address.firstName} {order.address.lastName}</div>
              <div>{order.address.street}</div>
              <div>{order.address.city}, {order.address.state} - {order.address.zipcode}</div>
              <div>{order.address.country}</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items</h3>
        <ul>
          {(order.items || []).map((it, idx) => (
            <li key={idx} className="mb-2 border p-2 rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Size: {it.size}</div>
                </div>
                <div>
                  <div className="font-medium">Qty: {it.quantity}</div>
                  <div className="text-sm">Price: {it.price}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderSuccess;
