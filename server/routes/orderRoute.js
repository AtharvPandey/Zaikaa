import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place order
orderRouter.post("/place", authMiddleware, placeOrder);

//Verify order
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
