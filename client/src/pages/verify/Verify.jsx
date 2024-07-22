import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Logging to check values
  console.log(`Success: ${success}, Order ID: ${orderId}`);
  console.log(`API URL: ${url}`);

  const verifyPayment = async () => {
    try {
      // Log URL and payload
      console.log(`Posting to URL: ${url}/api/order/verify`);
      console.log("Payload:", { success, order_id: orderId });

      // Corrected the payload key to match backend
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        order_id: orderId,
      });

      // Log the server response
      console.log("Server response:", response.data);

      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Enhanced error logging
      console.error(
        "Payment verification failed:",
        error.response?.data || error.message
      );
      navigate("/");
    }
  };

  useEffect(() => {
    if (success && orderId) {
      verifyPayment();
    } else {
      console.error("Missing parameters: success or orderId");
      navigate("/");
    }
  }, [success, orderId, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
