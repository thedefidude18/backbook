import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const initializePayment = async ({ amount, email }) => {
  // The correct URL should not include /api/v1 prefix based on your backend routes
  const url = `${process.env.REACT_APP_BACKEND_URL}/payments/paystack/initialize`;
  
  // Add the callback URL to the request
  const callbackUrl = `${window.location.origin}/wallet/payment-verification?provider=paystack`;
  
  try {
    const { data } = await axios.post(
      url,
      { 
        amount, 
        email,
        callback_url: callbackUrl 
      },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
};

export const usePaystackPayment = () => {
  return useMutation({
    mutationKey: "usePaystackPayment",
    mutationFn: initializePayment,
    onSuccess: (data) => {
      // Redirect to Paystack checkout page
      window.location.href = data.data.authorization_url;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Payment initialization failed");
    },
  });
};
