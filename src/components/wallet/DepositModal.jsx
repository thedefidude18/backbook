import React, { useState } from 'react';
import styles from './Wallet.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PaystackWidget from './PaystackWidget';

const DepositModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.userinfo);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  // Handle deposit success
  const handleDepositSuccess = (response) => {
    toast.success('Payment initiated successfully');
    onClose();
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h2>Deposit Funds</h2>
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
                You will deposit ₦{parseFloat(amount).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className={styles.form_group}>
            <label className={styles.input_label}>Payment Method</label>
            <div className={styles.payment_methods}>
              <div 
                className={`${styles.payment_method} ${paymentMethod === 'paystack' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('paystack')}
              >
                <div className={styles.payment_logo}>
                  <img 
                    src="/assets/paystack-logo.png" 
                    alt="Paystack" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add(styles.placeholder_logo);
                      e.target.parentNode.setAttribute('data-text', 'Paystack');
                    }}
                  />
                </div>
                <span>Paystack</span>
              </div>
              
              <div 
                className={`${styles.payment_method} ${paymentMethod === 'flutterwave' ? styles.selected : ''}`}
                onClick={() => setPaymentMethod('flutterwave')}
              >
                <div className={styles.payment_logo}>
                  <img 
                    src="/assets/flutterwave-logo.png" 
                    alt="Flutterwave" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add(styles.placeholder_logo);
                      e.target.parentNode.setAttribute('data-text', 'Flutter');
                    }}
                  />
                </div>
                <span>Flutterwave</span>
              </div>
              
              <div 
                className={`${styles.payment_method} ${paymentMethod === 'bank_transfer' ? styles.selected : ''} ${styles.disabled}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className={styles.payment_logo}>
                  <img 
                    src="/assets/bank-transfer.png" 
                    alt="Bank Transfer" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add(styles.placeholder_logo);
                      e.target.parentNode.setAttribute('data-text', 'Bank');
                    }}
                  />
                </div>
                <span>Bank Transfer (Coming Soon)</span>
              </div>
            </div>
          </div>
          
          <PaystackWidget 
            amount={amount ? parseFloat(amount) : 0} 
            onSuccess={handleDepositSuccess}
            onClose={onClose}
            paymentMethod={paymentMethod}
          />
          
          <p className={styles.deposit_note}>
            Note: Minimum deposit amount is ₦100. Your account will be credited immediately after successful payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
