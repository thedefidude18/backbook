import Header from "../header/Header";
import MobileFooterNav from "../mobileNav/MobileFooterNav";

export default function Layout({ user, children }) {
  console.log('Layout rendering, user:', user); // Debug log

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <MobileFooterNav user={user} />
    </>
  );
}
