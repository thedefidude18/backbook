import React, { useState, useEffect } from 'react';
import styles from './Wallet.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useWallet } from '../../hooks/useWallet';
import { useQueryClient } from '@tanstack/react-query';

const WithdrawModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBanks, setFetchingBanks] = useState(true);
  const user = useSelector((state) => state.user.userinfo);
  const { wallet } = useWallet();
  const queryClient = useQueryClient();

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/wallet/banks`,
          { withCredentials: true }
        );
        
        if (data.status === 'success') {
          setBanks(data.data.banks);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        toast.error('Failed to fetch banks');
      } finally {
        setFetchingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) < 500) {
      toast.error('Minimum withdrawal amount is ₦500');
      return;
    }

    if (parseFloat(amount) > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit account number');
      return;
    }

    if (!bankCode) {
      toast.error('Please select a bank');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/wallet/withdraw`,
        {
          amount: parseFloat(amount),
          account_number: accountNumber,
          bank_code: bankCode
        },
        { withCredentials: true }
      );
      
      if (data.status === 'success') {
        toast.success('Withdrawal request submitted successfully');
        // Invalidate wallet query to refresh the balance
        queryClient.invalidateQueries(['wallet']);
        onClose();
      } else {
        toast.error(data.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error(error.response?.data?.message || 'An error occurred while processing your withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h2>Withdraw Funds</h2>
          <button className={styles.close_button} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.deposit_form}>
          <div className={styles.form_group}>
            <label className={styles.input_label}>Amount (NGN)</label>
            <div className={styles.input_container}>
              <span className={styles.input_icon}>₦</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className={styles.amount_input}
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className={styles.conversion_text}>
                You will withdraw ₦{parseFloat(amount).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className={styles.form_group}>
            <label className={styles.input_label}>Select Bank</label>
            {fetchingBanks ? (
              <div className={styles.loading_banks}>Loading banks...</div>
            ) : (
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className={styles.bank_select}
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className={styles.form_group}>
            <label className={styles.input_label}>Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 10-digit account number"
              className={styles.amount_input}
              maxLength={10}
            />
          </div>
          
          <button 
            className={styles.withdraw_button}
            onClick={handleWithdraw}
            disabled={loading || !amount || parseFloat(amount) < 500 || !accountNumber || accountNumber.length !== 10 || !bankCode}
          >
            {loading ? 'Processing...' : `Withdraw ₦${amount ? parseFloat(amount).toLocaleString() : '0'}`}
          </button>
          
          <p className={styles.withdrawal_note}>
            Note: Minimum withdrawal amount is ₦500. Withdrawals are processed within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
