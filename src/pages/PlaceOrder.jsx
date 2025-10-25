import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [method, setMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const { backendUrl, cartItems, getCartAmount, delivery_fee, products, token, navigate: ctxNavigate } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // ✅ Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Order Submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // --- Validate form ---
    const requiredFields = ["firstName", "email", "street", "city", "state", "zipcode", "phone"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the ${field} field`);
        return;
      }
    }

    // --- Build Order Items ---
    let orderItems = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        if (cartItems[pid][size] > 0) {
          const product = products.find((p) => p._id === pid);
          if (product) {
            orderItems.push({
              ...product,
              size,
              quantity: cartItems[pid][size],
            });
          }
        }
      }
    }

    const cashHandlingFee = method === "cod" ? 99 : 0;
    const totalAmount = getCartAmount() + delivery_fee + cashHandlingFee;

    // ✅ COD case
    if (method === "cod") {
      alert("Cash on Delivery selected! Order placed successfully.");
      return;
    }

    // ✅ Razorpay Flow
    if (method === "razorpay") {
      try {
        setLoading(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Razorpay SDK failed to load.");
          setLoading(false);
          return;
        }

        // Create order on backend
        const { data } = await axios.post(`${backendUrl}/api/payment/create-order`, {
          amount: totalAmount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: { customerName: formData.firstName },
        });

        if (!data.success) {
          alert("Failed to create Razorpay order.");
          setLoading(false);
          return;
        }

        // helper to decode userId from token (if present)
        const decodeUserId = (tkn) => {
          try {
            if (!tkn) return null;
            const payload = JSON.parse(atob(tkn.split(".")[1]));
            return payload._id || payload.id || payload.userId || null;
          } catch (e) {
            return null;
          }
        };

        const options = {
          key: "rzp_test_RXMuMs1m7ss1bN", // Replace with your key
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Your Jewelry Store",
          description: "Order Payment",
          image: "/logo.png",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              // Build a compact items array to send to backend
              const itemsPayload = orderItems.map((it) => ({
                _id: it._id,
                name: it.name,
                price: it.price,
                size: it.size,
                quantity: it.quantity,
                image: it.image || (it.images && it.images[0]) || "",
              }));

              const userId = decodeUserId(token);

              const payload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  userId,
                  items: itemsPayload,
                  amount: totalAmount,
                  address: formData,
                },
              };

              const verifyRes = await axios.post(
                `${backendUrl}/api/payment/verify-payment`,
                payload,
                { headers: token ? { token } : {} }
              );

              if (verifyRes.data.success) {
                // If server created an order, prefer its orderId and order data
                const returnedOrderId = verifyRes.data.orderId || (verifyRes.data.order && verifyRes.data.order._id) || null;
                const returnedOrder = verifyRes.data.order || null;

                // Clear loading and navigate to order page
                setLoading(false);
                if (returnedOrderId) {
                  navigate(`/order/${returnedOrderId}`, { state: { order: returnedOrder } });
                } else {
                  // Fallback: navigate to a generic order success page with state
                  navigate("/order-success", { state: { payment: verifyRes.data, order: payload.orderDetails } });
                }
                return;
              } else {
                alert("Payment verification failed.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Verification failed. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: `${formData.street}, ${formData.city}, ${formData.state}`,
          },
          theme: { color: "#D4AF37" },
          modal: {
            ondismiss: () => {
              alert("Payment cancelled.");
              setLoading(false);
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Payment error:", error);
        alert("Something went wrong.");
        setLoading(false);
      }
    }
  };

  return (
    <form
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      onSubmit={onSubmitHandler}
    >
      {/* Left Side - Delivery Info */}
      <div className="px-4 sm:px-16 flex flex-col gap-4 w-full sm:max-w-[580px]">
        <Title text1={"DELIVERY"} text2={"INFORMATION"} />

        <div className="flex gap-3">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <div className="flex gap-3">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            type="text"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          type="text"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side - Cart + Payment */}
      <div className="px-4 sm:px-16 mt-8">
        <CartTotal extraCharge={method === "cod" ? 99 : 0} />

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={() => setMethod("razorpay")}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
            </div>
            <div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={() => setMethod("cod")}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm mx-4 font-medium">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-16 py-3 text-sm"
            >
              {loading ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
