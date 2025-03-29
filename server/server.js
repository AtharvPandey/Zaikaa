// import express from "express";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import foodRouter from "./routes/foodRoute.js";
// import userRouter from "./routes/userRoute.js";
// import cartRouter from "./routes/cartRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import "dotenv/config"; // Import dotenv to use environment variables

// // app config
// const app = express();
// const port = 4000;

// // middleware
// app.use(express.json());
// app.use(cors());

// // db connection
// connectDB();

// //api end point
// app.use("/api/food", foodRouter);
// app.use("/images", express.static("uploads"));
// app.use("/api/user", userRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);

// app.get("/", (req, res) => {
//   res.send("API Working");
// });

// app.listen(port, () => {
//   console.log(`server started on http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { handleStripeWebhook } from "./controllers/orderController.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
  
    origin: "https://zaikaa.vercel.app",
  })
);
app.use(express.json());

// Stripe webhook must use raw body
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// DB Connection
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
