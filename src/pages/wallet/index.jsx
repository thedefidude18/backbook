import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Wallet.module.css';
import WalletCard from '../../components/wallet/WalletCard';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import DepositModal from '../../components/wallet/DepositModal';
import WithdrawModal from '../../components/wallet/WithdrawModal';
import { useWallet } from '../../hooks/useWallet';
import { useQueryClient } from '@tanstack/react-query';

function Wallet() {
  const navigate = useNavigate();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { balance, currency, isLoading, refreshWallet } = useWallet();
  const queryClient = useQueryClient();

  // Force refresh wallet data when component mounts
  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleCloseDepositModal = () => {
    setShowDepositModal(false);
    refreshWallet();
  };

  const handleCloseWithdrawModal = () => {
    setShowWithdrawModal(false);
    refreshWallet();
  };

  return (
    <div className={styles.wallet_container}>
      <header className={styles.wallet_header}>
        <button 
          className={styles.back_button}
          onClick={() => navigate(-1)}
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
        <WalletCard 
          loading={isLoading} 
          balance={balance} 
          onDeposit={handleDeposit} 
          onWithdraw={handleWithdraw} 
        />
        <TransactionHistory />
      </div>

      {showDepositModal && (
        <DepositModal onClose={handleCloseDepositModal} />
      )}

      {showWithdrawModal && (
        <WithdrawModal onClose={handleCloseWithdrawModal} />
      )}
    </div>
  );
}

export default Wallet;
