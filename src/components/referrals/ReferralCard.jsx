import React, { useState } from 'react';
import { useReferral } from '../../hooks/useReferral';
import Card from '../UI/Card/Card';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import FormLoader from '../FormLoader';
import classes from './ReferralCard.module.css';

function ReferralCard() {
  const { referralCode, stats, generateReferralCode } = useReferral();
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (referralCode) {
      try {
        await navigator.share({
          title: 'Join me on Backbook',
          text: `Use my referral code ${referralCode} to join Backbook!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback for browsers that don't support navigator.share
        toast.success('Referral code copied to clipboard!');
      }
    }
  };

  const handleGenerateCode = async () => {
    if (!referralCode) {
      setLoading(true);
      await generateReferralCode();
      setLoading(false);
    }
  };

  return (
    <Card className={classes.referral_card}>
      <FormLoader loading={loading}>
        <div className={classes.header}>
          <h2>Refer & Earn</h2>
          <button 
            className={classes.share_btn}
            onClick={handleShare}
            disabled={!referralCode}
          >
            <i className="share_icon"></i>
          </button>
        </div>

        <div className={classes.stats_container}>
          <div className={classes.stat_box}>
            <div className={classes.stat_icon}>
              <i className="friends_icon"></i>
            </div>
            <p className={classes.stat_label}>Total Referrals</p>
            <p className={classes.stat_value}>{stats.totalReferrals}</p>
          </div>
          <div className={classes.stat_box}>
            <div className={classes.stat_icon}>
              <i className="gift_icon"></i>
            </div>
            <p className={classes.stat_label}>Total Rewards</p>
            <p className={classes.stat_value}>${stats.totalRewards.toFixed(2)}</p>
          </div>
        </div>

        <div className={classes.code_container}>
          <div>
            <span className={classes.code_label}>Your Referral Code</span>
            <p className={classes.code_value}>
              {referralCode || (
                <button 
                  className="btn_blue" 
                  onClick={handleGenerateCode}
                >
                  Generate Code
                </button>
              )}
            </p>
          </div>
          {referralCode && (
            <CopyToClipboard
              text={referralCode}
              onCopy={() => toast.success('Referral code copied!')}
            >
              <button className={classes.copy_btn}>
                <i className="copy_icon"></i>
              </button>
            </CopyToClipboard>
          )}
        </div>

        <p className={classes.info_text}>
          Earn rewards for every friend who joins using your referral code. Plus, get bonus rewards when they become active users!
        </p>
      </FormLoader>
    </Card>
  );
}

export default ReferralCard;