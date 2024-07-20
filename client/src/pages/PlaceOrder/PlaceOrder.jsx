import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { calculateDeliveryCost } from "../Cart/CalculateDeliveryCost";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const totalCartAmount = getTotalCartAmount();
  const deliveryCost =
    totalCartAmount === 0 ? 0 : calculateDeliveryCost(totalCartAmount);

  const navigate = useNavigate();

  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
        </div>
        <input type="email" placeholder="Email Address" />
        <input type="text" placeholder="Street" />
        <div className="multi-fields">
          <input type="text" placeholder="City" />
          <input type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="Zip Code" />
          <input type="text" placeholder="Country" />
        </div>
        <input type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {totalCartAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {deliveryCost}</p>
            </div>
            <p className="delivery-condition">
              {totalCartAmount > 499
                ? "Congratulations! You have free delivery."
                : "Add items worth ₹" +
                  (499 - totalCartAmount) +
                  " more for free delivery."}
            </p>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {totalCartAmount + deliveryCost}</b>
            </div>
          </div>
          <button type="button" onClick={() => navigate("/order")}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
