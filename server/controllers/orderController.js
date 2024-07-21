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
  const frontend_url = "http://localhost:5173"; // Update this to your frontend URL

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
      amount: item.price * 100 * 83, // in paise (smallest unit of INR)
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
      name: "Zaikaa",
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
        color: "#F37254",
      },
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
  } catch (error) {
    console.log(error);
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

export { placeOrder, verifyPayment };
