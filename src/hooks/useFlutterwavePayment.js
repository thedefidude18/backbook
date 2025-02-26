import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import React from 'react';

// This function will initialize the payment on the server
const initializePayment = async ({ amount, email }) => {
  // Use the correct URL without the /api/v1 prefix
  const url = `${process.env.REACT_APP_BACKEND_URL}/payments/flutterwave/initialize`;
  // For direct testing, you can use:
  // const url = "http://localhost:5001/payments/flutterwave/initialize";
  
  const { data } = await axios.post(
    url,
    { amount, email },
    {
      withCredentials: true,
    }
  );
  return data;
};

// This hook should be used directly in a component, not in another hook
export const useFlutterwavePayment = () => {
  return useMutation({
    mutationKey: "useFlutterwavePayment",
    mutationFn: initializePayment,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Payment initialization failed");
    },
  });
};

// This is a separate component function that uses both hooks correctly
export const FlutterwavePaymentButton = ({ amount, email, onSuccess }) => {
  const { mutate, data, isLoading } = useFlutterwavePayment();
  
  // Only call useFlutterwave when we have the config data
  const handleFlutterPayment = useFlutterwave({
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: data?.data?.tx_ref || "",
    amount: data?.data?.amount || 0,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: data?.data?.customer?.email || email,
      name: data?.data?.customer?.name || "",
    },
    customizations: {
      title: "Backbook Wallet Funding",
      description: "Payment for wallet funding",
      logo: "https://backbook.vercel.app/logo.png",
    },
    callback: (response) => {
      closePaymentModal();
      if (response.status === "successful") {
        onSuccess && onSuccess(response);
      } else {
        toast.error("Payment was not successful");
      }
    },
    onClose: () => {
      toast.error("Payment cancelled");
    },
  });

  // Initialize payment when button is clicked
  const handlePayment = () => {
    mutate({ amount, email });
  };

  // When data is available after mutation, trigger the payment modal
  React.useEffect(() => {
    if (data) {
      handleFlutterPayment();
    }
  }, [data, handleFlutterPayment]);

  return (
    <button 
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-[#CCFF00] text-black py-3 rounded-lg hover:bg-[#CCFF00]/90 transition-colors"
    >
      {isLoading ? "Processing..." : "Pay with Flutterwave"}
    </button>
  );
};
