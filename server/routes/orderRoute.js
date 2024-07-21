import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyPayment } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place order
orderRouter.post("/place", authMiddleware, placeOrder);

// Verify payment
orderRouter.post("/verify-payment", verifyPayment);

export default orderRouter;
