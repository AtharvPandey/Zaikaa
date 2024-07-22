import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place order
orderRouter.post("/place", authMiddleware, placeOrder);

//Verify order
orderRouter.post("/verify", verifyOrder);

// users Order
orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;
