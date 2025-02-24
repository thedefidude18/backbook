import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MobileFooterNav.module.css';
import MobileMenu from './MobileMenu/MobileMenu';

function MobileFooterNav({ user }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.mobileNav}>
        <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
          <img 
            src="/icons/events-icon.png" 
            alt="Home"
            className={styles.navIcon}
          />
        </Link>
        
        <Link to="/friends" className={location.pathname === '/friends' ? styles.active : ''}>
          <img 
            src="/icons/friends.svg" 
            alt="Friends"
            className={styles.navIcon}
          />
          {user?.recivedRequestsCount > 0 && (
            <span className={styles.badge}>{user.recivedRequestsCount}</span>
          )}
        </Link>

        <Link to="/create-event" className={location.pathname === '/create-event' ? styles.active : ''}>
          <img 
            src="/icons/create.png" 
            alt="Create Event"
            className={styles.navIcon}
          />
        </Link>

        <Link to="/marketplace" className={location.pathname === '/marketplace' ? styles.active : ''}>
          <img 
            src="/icons/marketplace.svg" 
            alt="Marketplace"
            className={styles.navIcon}
          />
        </Link>

        <Link to="/profile" className={location.pathname === '/profile' ? styles.active : ''}>
          <img 
            src="/icons/profile.svg" 
            alt="Profile"
            className={styles.navIcon}
          />
        </Link>
      </nav>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        user={user}
      />
    </>
  );
}

export default MobileFooterNav;















