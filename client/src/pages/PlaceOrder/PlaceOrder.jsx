import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { calculateDeliveryCost } from "../Cart/CalculateDeliveryCost";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const totalCartAmount = getTotalCartAmount();
  const deliveryCost =
    totalCartAmount === 0 ? 0 : calculateDeliveryCost(totalCartAmount);

  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalCartAmount + deliveryCost,
      userId: "YOUR_USER_ID", // Add the actual user ID here
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const {
          order_id,
          amount,
          key,
          name,
          description,
          prefill,
          notes,
          theme,
        } = response.data;

        // Load Razorpay script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: key, // Razorpay Key ID
            amount: amount, // Amount in paise
            currency: "INR",
            name: name,
            description: description,
            order_id: order_id,
            prefill: prefill,
            notes: notes,
            theme: theme,
            handler: function (response) {
              axios
                .post(`${url}/api/payment/verify`, {
                  order_id: order_id,
                  payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
                .then((res) => {
                  if (res.data.success) {
                    alert("Payment Successful");
                    navigate(`/verify?success=true&orderId=${order_id}`);
                  } else {
                    alert("Payment Verification Failed");
                    navigate(`/verify?success=false&orderId=${order_id}`);
                  }
                });
            },
            modal: {
              ondismiss: function () {
                navigate(`/verify?success=false&orderId=${order_id}`);
              },
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        };
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
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
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
