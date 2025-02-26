import React from 'react';
import { useReferral } from '../../hooks/useReferral';
import ReferralCard from '../../components/referrals/ReferralCard';
import ApplyReferralCode from '../../components/referrals/ApplyReferralCode';
import FriendCard from '../friends/FreindCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PuffLoader from 'react-spinners/PuffLoader';
import classes from './style.module.css';

function ReferralsPage() {
  const { stats } = useReferral();
  
  const { data, isLoading } = useQuery({
    queryKey: ['getReferredUsers'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/referrals/users`,
        { withCredentials: true }
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className={classes.container}>
      <div className={classes.left_side}>
        <ReferralCard />
        <ApplyReferralCode />
      </div>
      
      <div className={classes.right_side}>
        <div className={classes.header}>
          <h2>People You've Referred</h2>
          <span className={classes.count}>{stats.totalReferrals} people</span>
        </div>
        
        {isLoading ? (
          <div className={classes.loading}>
            <PuffLoader color="#1876f2" loading={isLoading} size={40} />
          </div>
        ) : data?.data?.referredUsers?.length > 0 ? (
          <div className={classes.referred_users}>
            {data.data.referredUsers.map((referral) => (
              <FriendCard
                key={referral._id}
                user={referral.user}
                type="referred"
                requestId={referral._id}
                refetch={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className={classes.empty_state}>
            <img src="../../../icons/referral_empty.png" alt="No referrals" />
            <p>You haven't referred anyone yet</p>
            <span>Share your referral code with friends to start earning rewards!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferralsPage;