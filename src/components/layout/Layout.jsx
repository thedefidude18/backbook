import Header from "../header/Header";
import MobileFooterNav from "../mobileNav/MobileFooterNav";
import { useSelector } from 'react-redux';

export default function Layout({ children }) {
  const user = useSelector((state) => ({ ...state.user.userinfo }));

  return (
    <>
      <Header />
      <main>{children}</main>
      <MobileFooterNav user={user} />
    </>
  );
}
