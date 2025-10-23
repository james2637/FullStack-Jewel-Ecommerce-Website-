import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ subtotalOverride, extraCharge = 0 }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = typeof subtotalOverride === 'number' ? subtotalOverride : getCartAmount();
  const shipping = subtotal > 0 ? delivery_fee : 0;
  const total = subtotal + shipping + (extraCharge || 0);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{currency}{subtotal}.00</p>
        </div>
        <hr />
        <div className="flex justify-between">
            <p>Shipping fee</p>
            <p>{currency}{shipping}.00</p>
        </div>
        {extraCharge > 0 && (
          <>
            <hr />
            <div className="flex justify-between">
              <p>Cash handling fee</p>
              <p>{currency}{extraCharge}.00</p>
            </div>
          </>
        )}
        <hr />
        <div className="flex justify-between">
            <b>Total</b>
            <b>{currency}{total}.00</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
