import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileMenu.module.css';

function MobileMenu({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Settings & Privacy', icon: '⚙️', path: '/settings' },
    { name: 'Help & Support', icon: '❓', path: '/help' },
    { name: 'Display & Accessibility', icon: '🎨', path: '/display' },
    { name: 'Give Feedback', icon: '📝', path: '/feedback' },
    { name: 'Log Out', icon: '🚪', path: '/logout' },
  ];

  return (
    <div className={styles.menuOverlay} onClick={onClose}>
      <div className={styles.menuContainer} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.menuHeader}>
          <div className={styles.userInfo}>
            <img 
              src={user?.photo || '/default-user.png'} 
              alt={user?.username} 
              className={styles.userPhoto}
            />
            <div className={styles.userDetails}>
              <h3>{user?.first_name} {user?.last_name}</h3>
              <Link to="/profile" onClick={onClose}>View your profile</Link>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {/* Menu Items */}
        <div className={styles.menuContent}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={styles.menuItem}
              onClick={onClose}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;