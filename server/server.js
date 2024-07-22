// import express from "express";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import foodRouter from "./routes/foodRoute.js";
// import userRouter from "./routes/userRoute.js";
// import cartRouter from "./routes/cartRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import "dotenv/config"; // Import dotenv to use environment variables

// // App config
// const app = express();
// const port = process.env.PORT || 4000; // Use environment variable for port if available

// // Middleware
// app.use(express.json());

// // Configure CORS to allow requests from specific origins
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://zaikaa.vercel.app"], // Your frontend URLs
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Allow cookies and authentication headers
//   })
// );

// // Database connection
// connectDB();

// // API endpoints
// app.use("/api/food", foodRouter);
// app.use("/images", express.static("uploads"));
// app.use("/api/user", userRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);

// // Root endpoint
// app.get("/", (req, res) => {
//   res.send("API Working");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config"; // Import dotenv to use environment variables

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

//api end point
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
