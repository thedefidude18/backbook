import React from 'react';

function PaystackWidget({ amount, onSuccess, onClose, type }) {
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
    <button 
      onClick={() => {
        // Implement Paystack integration here
        console.log('Processing payment:', { amount, type });
      }}
      className="w-full bg-[#CCFF00] text-black py-3 rounded-lg hover:bg-[#CCFF00]/90 transition-colors font-medium"
    >
      {type === 'fiat' ? 'Deposit' : 'Buy Coins'} ₦{amount.toLocaleString()}
    </button>
  );
}

export default PaystackWidget;