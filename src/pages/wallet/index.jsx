import React from 'react';
import styles from './Wallet.module.css';  // Updated import path
import WalletCard from '../../components/wallet/WalletCard';
import TransactionHistory from '../../components/wallet/TransactionHistory';

function Wallet() {
  return (
    <div className={styles.wallet_container}>
      <header className={styles.wallet_header}>
        <button
          onClick={() => window.history.back()}
          className={styles.back_button}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.back_icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className={styles.header_title}>
          <h1>Wallet</h1>
        </div>
      </header>

      <div className={styles.wallet_content}>
        <WalletCard />
        <TransactionHistory />
      </div>
    </div>
  );
}

export default Wallet;
