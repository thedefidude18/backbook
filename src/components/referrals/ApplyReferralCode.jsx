import React, { useState } from 'react';
import { useReferral } from '../../hooks/useReferral';
import Card from '../UI/Card/Card';
import FormLoader from '../FormLoader';
import toast from 'react-hot-toast';
import classes from './ApplyReferralCode.module.css';

function ApplyReferralCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { applyReferralCode } = useReferral();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    setLoading(true);
    const success = await applyReferralCode(code.trim());
    setLoading(false);

    if (success) {
      toast.success('Referral code applied successfully!');
      setCode('');
    } else {
      toast.error('Invalid or expired referral code');
    }
  };

  return (
    <Card className={classes.apply_card}>
      <FormLoader loading={loading}>
        <h3>Have a referral code?</h3>
        <p className={classes.subtitle}>Enter it below to get started with rewards</p>
        
        <form onSubmit={handleSubmit} className={classes.form}>
          <input
            type="text"
            placeholder="Enter referral code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={classes.input}
          />
          <button type="submit" className="btn_blue">
            Apply Code
          </button>
        </form>
      </FormLoader>
    </Card>
  );
}

export default ApplyReferralCode;