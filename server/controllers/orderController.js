// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// //placing user order from frontend
// const placeOrder = async (req, res) => {
//   // const frontend_url = "http://localhost:5173";
//   const frontend_url = "https://zaikaa.vercel.app";

//   try {
//     // const { userId, items, amount, address } = req.body;

//     // Create a new order
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });

//     // Save the order in the database
//     await newOrder.save();

//     // Clear the user's cart data
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Create line items for Stripe session
//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "INR",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100, // Corrected from unit_anount to unit_amount
//       },
//       quantity: item.quantity,
//     }));

//     // Add delivery charges
//     line_items.push({
//       price_data: {
//         currency: "INR",
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: 49 * 100,
//       },
//       quantity: 1,
//     });

//     // Create a Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       line_items: line_items,
//       mode: "payment",
//       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     });

//     // Send the session URL as a response
//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // verify order
// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;
//   try {
//     if (success == "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       res.json({ success: true, message: "Paid" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Not Paid" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // user order for frontend
// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// export { placeOrder, verifyOrder, userOrders };

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place Order Function
const placeOrder = async (req, res) => {
  const frontend_url = "https://zaikaa.vercel.app";

  try {
    // Create a new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the order in the database
    await newOrder.save();

    // Clear the user's cart data
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create line items for Stripe session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 49 * 100,
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(), // Passing the orderId as metadata
      },
    });

    // Send the session URL as a response
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Handle Stripe Webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Update order payment status to true in your database
    const orderId = session.metadata.orderId;
    await orderModel.findByIdAndUpdate(orderId, { payment: true });

    console.log(`Payment for order ${orderId} was successful.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

// Verify Order Function
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// User Orders Function
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { placeOrder, handleStripeWebhook, verifyOrder, userOrders };
