import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export function useReferral() {
  const [referralCode, setReferralCode] = useState(null);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalRewards: 0
  });
  
  const user = useSelector((state) => state.user.userinfo);

  const fetchReferralStats = useCallback(async () => {
    if (!user) return;

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/referrals/stats`,
        { withCredentials: true }
      );
      
      if (data.status === "success") {
        setStats({
          totalReferrals: data.data.totalReferrals || 0,
          pendingReferrals: data.data.pendingReferrals || 0,
          completedReferrals: data.data.completedReferrals || 0,
          totalRewards: data.data.totalRewards || 0
        });
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  }, [user]);

  const generateReferralCode = useCallback(async () => {
    if (!user) return null;

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/referrals/code`,
        { withCredentials: true }
      );
      
      if (data.status === "success" && data.data.code) {
        setReferralCode(data.data.code);
        return data.data.code;
      }
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/referrals/generate`,
        {},
        { withCredentials: true }
      );
      
      if (data.status === "success" && data.data.code) {
        setReferralCode(data.data.code);
        return data.data.code;
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
    }

    return null;
  }, [user]);

  const applyReferralCode = useCallback(async (code) => {
    if (!user) return false;

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/referrals/apply`,
        { code },
        { withCredentials: true }
      );
      
      return data.status === "success";
    } catch (error) {
      console.error('Error applying referral code:', error);
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      generateReferralCode();
      fetchReferralStats();
    }
  }, [user, generateReferralCode, fetchReferralStats]);

  return {
    referralCode,
    stats,
    generateReferralCode,
    applyReferralCode,
    fetchReferralStats
  };
}