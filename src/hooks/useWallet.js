import { useSelector } from 'react-redux';

export const useWallet = () => {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  
  return {
    wallet: user?.wallet || { balance: 0 },
    loading: false
  };
};