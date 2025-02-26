import React from 'react';
import { usePaystackPayment } from '../../hooks/usePaystackPayment';
import { FlutterwavePaymentButton } from '../../hooks/useFlutterwavePayment';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PaystackWidget({ amount, onSuccess, onClose, type, paymentMethod = 'paystack' }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userinfo);
  
  const { mutate: initiatePaystack, isLoading: paystackLoading } = usePaystackPayment();
  
  const handlePaystackPayment = () => {
    initiatePaystack(
      { amount, email: user.email },
      {
        onSuccess: (data) => {
          // Redirect happens in the hook
        }
      }
    );
  };

  const handleFlutterwaveSuccess = (response) => {
    toast.success('Payment successful!');
    onSuccess && onSuccess(response);
    navigate('/wallet');
  };
  
  if (!amount || amount < 100) {
    return (
      <button 
        disabled 
        className="w-full bg-gray-600 text-white py-3 rounded-lg opacity-50 cursor-not-allowed"
      >
        Enter amount above ₦100
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethod === 'paystack' ? (
        <button
          onClick={handlePaystackPayment}
          disabled={paystackLoading}
          className="w-full bg-[#CCFF00] text-black py-3 rounded-lg hover:bg-[#CCFF00]/90 transition-colors"
        >
          {paystackLoading ? "Processing..." : "Pay with Paystack"}
        </button>
      ) : (
        <FlutterwavePaymentButton 
          amount={amount} 
          email={user.email} 
          onSuccess={handleFlutterwaveSuccess} 
        />
      )}
    </div>
  );
}

export default PaystackWidget;
