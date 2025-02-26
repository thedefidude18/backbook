import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { updateUserInfo } from '../app/slices/userSlice';

export const useWallet = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userinfo);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/wallet/balance`,
        { withCredentials: true }
      );
      
      // Update the user info in Redux with the latest wallet balance
      if (data.status === 'success' && data.data) {
        // Only update if the balance is different
        if (user?.wallet?.balance !== data.data.balance) {
          // Fetch the full user data to update Redux
          try {
            const userResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/me`,
              { withCredentials: true }
            );
            
            if (userResponse.data.status === 'success') {
              dispatch(updateUserInfo(userResponse.data.data.user));
            }
          } catch (error) {
            console.error('Error updating user data:', error);
          }
        }
      }
      
      return data.data;
    },
    initialData: {
      balance: user?.wallet?.balance || 0,
      currency: 'NGN'
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 300000, // 5 minutes
  });

  const refreshWallet = () => {
    queryClient.invalidateQueries(['wallet']);
    queryClient.invalidateQueries(['transactions']);
  };

  return {
    balance: data?.balance || 0,
    currency: data?.currency || 'NGN',
    isLoading,
    error,
    refetch,
    refreshWallet
  };
};
