import React from 'react';
import styles from './Wallet.module.css';

function TransactionHistory() {
  return (
    <div className={styles.transaction_history}>
      <h2>Transaction History</h2>
      <div className={styles.transactions}>
        {/* Add transaction items here */}
        <div className={styles.empty_state}>
          No transactions yet
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;