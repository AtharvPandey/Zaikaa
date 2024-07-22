import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  const frontend_url = "https://zaikaa.vercel.app"; // Update this to your frontend URL

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Calculate the total amount
    const line_items = req.body.items.map((item) => ({
      name: item.name,
      amount: item.price * 100, // in paise
      currency: "INR",
      quantity: item.quantity,
    }));

    line_items.push({
      name: "Delivery Charges",
      amount: 49 * 100,
      currency: "INR",
      quantity: 1,
    });

    const totalAmount = line_items.reduce(
      (total, item) => total + item.amount * item.quantity,
      0
    );

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${newOrder._id}`,
      payment_capture: "1", // auto capture
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: "Zaikaa food app",
      description: "Order Payment",
      prefill: {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.phone,
      },
      notes: {
        address: req.body.address,
      },
      theme: {
        color: "#f2ae1c",
      },
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
  } catch (error) {
    console.log("Error placing order:", error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyPayment = (req, res) => {
  const { order_id, payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body; // Ensure the key names match the ones in your frontend
  try {
    if (success === "true") {
      // Update order with the correct ID
      await orderModel.findOneAndUpdate({ _id: orderId }, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      // Delete order with the correct ID
      await orderModel.findOneAndDelete({ _id: orderId });
      res.json({ success: false, message: "NotPaid" });
    }
  } catch (error) {
    console.log("Error verifying order:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyPayment, verifyOrder };
