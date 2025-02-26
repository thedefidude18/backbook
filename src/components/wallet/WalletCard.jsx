import React from 'react';
import FormLoader from '../FormLoader';

const WalletCard = ({ loading, balance, onDeposit, onWithdraw }) => {
  return (
    <div className="wallet-card">
      {loading ? (
        <FormLoader />
      ) : (
        <div>
          <h2>Wallet Balance</h2>
          <p>${balance}</p>
          <div className="actions">
            <button onClick={onDeposit}>Deposit</button>
            <button onClick={onWithdraw}>Withdraw</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
