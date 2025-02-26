import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../app/slices/userSlice';

function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // For Paystack, the reference is in 'reference' or 'trxref'
    // For Flutterwave, it's in 'tx_ref' or 'transaction_id'
    const reference = 
      searchParams.get('reference') || 
      searchParams.get('trxref') || 
      searchParams.get('tx_ref') || 
      searchParams.get('transaction_id');
      
    const paymentProvider = searchParams.get('provider') || 'paystack';
    
    if (!reference) {
      toast.error('Invalid payment reference');
      navigate('/wallet');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Use the appropriate endpoint based on the payment provider
        const endpoint = paymentProvider === 'flutterwave' 
          ? `${process.env.REACT_APP_BACKEND_URL}/payments/flutterwave/verify/${reference}`
          : `${process.env.REACT_APP_BACKEND_URL}/payments/paystack/verify/${reference}`;
        
        console.log('Verifying payment at:', endpoint);
        
        const { data } = await axios.get(endpoint, { withCredentials: true });
        console.log('Verification response:', data);
        
        if (data.status === 'success') {
          setStatus('success');
          toast.success('Payment verified successfully!');
          
          // Invalidate wallet query to refresh the balance
          queryClient.invalidateQueries(['wallet']);
          queryClient.invalidateQueries(['transactions']);
          
          // Fetch updated user data to update the wallet balance in Redux store
          try {
            const userResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/me`,
              { withCredentials: true }
            );
            
            if (userResponse.data.status === 'success') {
              // Update the user info in Redux store with the new wallet balance
              dispatch(updateUserInfo(userResponse.data.data.user));
            }
          } catch (userError) {
            console.error('Error fetching updated user data:', userError);
          }
        } else {
          setStatus('failed');
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
        toast.error(error.response?.data?.message || 'Payment verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, queryClient, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {verifying ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#CCFF00] border-b-[#CCFF00] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      ) : status === 'success' ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your wallet has been credited successfully.</p>
          <button
            onClick={() => navigate('/wallet')}
            className="bg-[#CCFF00] text-black py-2 px-6 rounded-lg hover:bg-[#CCFF00]/90 transition-colors font-medium"
          >
            Go to Wallet
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please try again.</p>
          <button
            onClick={() => navigate('/wallet')}
            className="bg-[#CCFF00] text-black py-2 px-6 rounded-lg hover:bg-[#CCFF00]/90 transition-colors font-medium"
          >
            Go to Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentVerification;
