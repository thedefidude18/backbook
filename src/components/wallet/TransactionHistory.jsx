import React from 'react';
import styles from './Wallet.module.css';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import FormLoader from '../FormLoader';

function TransactionHistory() {
  const { ref, inView } = useInView();
  
  const fetchTransactions = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/wallet/transactions?page=${pageParam}&limit=10`,
      { withCredentials: true }
    );
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.data) return undefined;
      return lastPage.data.hasMore ? lastPage.data.nextPage : undefined;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Use effect to fetch next page when scrolled to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Force refetch when component mounts
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle loading state
  if (isLoading) {
    return <FormLoader />;
  }

  // Handle error state
  if (isError) {
    return <div className={styles.error}>Failed to load transactions</div>;
  }

  // Safely extract transactions from data
  const transactions = data?.pages?.flatMap(page => page.data?.transactions || []) || [];

  return (
    <div className={styles.transaction_history}>
      <h2>Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className={styles.no_transactions}>
          No transactions yet
        </div>
      ) : (
        <>
          <div className={styles.transactions_list}>
            {transactions.map((transaction) => (
              <div key={transaction._id} className={styles.transaction_item}>
                <div className={styles.transaction_details}>
                  <span className={styles.transaction_type}>
                    {transaction.type}
                  </span>
                  <span className={styles.transaction_date}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.transaction_amount}>
                  <span className={transaction.type === 'deposit' ? styles.amount_positive : styles.amount_negative}>
                    {transaction.type === 'deposit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load more reference element */}
          {hasNextPage && (
            <div ref={ref} className={styles.load_more}>
              {isFetchingNextPage ? <FormLoader /> : 'Load more'}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionHistory;
