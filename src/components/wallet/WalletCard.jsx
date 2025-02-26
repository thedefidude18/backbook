import React from 'react';
import styles from './Wallet.module.css';
import FormLoader from '../FormLoader';

const WalletCard = ({ loading, balance, onDeposit, onWithdraw }) => {
  return (
    <div className={styles.wallet_card}>
      {loading ? (
        <div className={styles.loading}>
          <FormLoader />
        </div>
      ) : (
        <>
          <div className={styles.balance_header}>
            <span className={styles.balance_label}>Available Balance</span>
            <div className={styles.wallet_icons}>
              <div className={styles.icon_container}>
                <span className={styles.wallet_icon}>💰</span>
              </div>
            </div>
          </div>
          <div className={styles.balance_amount}>
            {new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: 'NGN',
              minimumFractionDigits: 2
            }).format(balance || 0)}
          </div>
          
          <div className={styles.quick_actions}>
            <button 
              className={`${styles.action_button} ${styles.deposit_button}`}
              onClick={onDeposit}
            >
              <span className={styles.action_icon}>↑</span>
              <span>Deposit</span>
            </button>
            <button 
              className={`${styles.action_button} ${styles.withdraw_button}`}
              onClick={onWithdraw}
            >
              <span className={styles.action_icon}>↓</span>
              <span>Withdraw</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletCard;
