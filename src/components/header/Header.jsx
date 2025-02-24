import React, { useState, useRef } from "react";
import styles from "./Header.module.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowDown,
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Logo,
  Market,
  Messenger,
  Notifications,
  Search,
  Watch,
} from "../../svg";
import SearchMenu from "./SearchMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import UserMenu from "./userMenu/index";
import NotificationMenu from "./notificationMenu/NotificationMenu";
function Header() {
  const color = "#65676b";
  const input = useRef();
  const [showIcon, setShowIcon] = useState(true);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const usermenu = useRef(null);
  const notificationmenu = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useOnClickOutside(usermenu, showUserMenu, () => {
    setShowUserMenu(false);
  });

  useOnClickOutside(notificationmenu, showNotificationMenu, () => {
    setShowNotificationMenu(false);
  });

  const user = useSelector((state) => ({ ...state.user.userinfo }));
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <div className={styles.circle}>
            <img 
              src="/icons/bantahblue.svg" 
              alt="Bantah Logo"
              width="40"
              height="40"
            />
          </div>
        </Link>
        <div
          className={styles.search}
          onClick={() => {
            input.current.focus();
            setShowSearchMenu(true);
          }}
        >
          {showIcon && <Search color={color} />}
          <input
            ref={input}
            type="text"
            name="search"
            placeholder="Search Bantah"
            className={styles.input}
            onFocus={() => {
              setShowIcon(false);
              setShowSearchMenu(true);
            }}
            onBlur={() => setShowIcon(true)}
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          color={color}
          showSearchMenu={showSearchMenu}
          setShowSearchMenu={setShowSearchMenu}
        />
      )}
      <div className={styles.middle}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.active} ${styles.middle_icon}`
              : styles.middle_icon
          }
        >
          {({ isActive }) => (
            isActive ? (
              <img 
                src="/icons/home-active.svg" 
                alt="Home"
                className={styles.active_icon}
                width="24"
                height="24"
              />
            ) : (
              <img 
                src="/icons/home.svg" 
                alt="Home"
                className={styles.icon}
                width="24"
                height="24"
              />
            )
          )}
        </NavLink>

        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <img 
            src="/icons/watch.svg" 
            alt="Watch"
            className={styles.icon}
            width="24"
            height="24"
            style={{ transform: "translateY(5px)" }}
          />
          <div
            style={{ transform: "translateY(3px)" }}
            className={styles.notification}
          >
            9+
          </div>
        </Link>

        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <img 
            src="/icons/market.svg" 
            alt="Marketplace"
            className={styles.icon}
            width="24"
            height="24"
          />
        </Link>

        <Link to="/" className={`${styles.middle_icon} hover1`}>
          <img 
            src="/icons/gaming.svg" 
            alt="Gaming"
            className={styles.icon}
            width="24"
            height="24"
          />
        </Link>
      </div>
      <div className={styles.right}>
        <button 
          onClick={() => navigate('/wallet')}
          className={styles.wallet_button}
        >
          <span role="img" aria-label="wallet">💰</span>
          {new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
          }).format(user?.wallet?.balance || 0)}
        </button>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive &&
            (location.pathname === "/profile" ||
              location.pathname === `/profile/${user?.username}`)
              ? `${styles.profile_active} ${styles.profile}`
              : `${styles.profile} hover1`
          }
        >
          <img src={user?.photo} alt={user?.username} className="shadow" />
          <span>{user?.first_name}</span>
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            isActive
              ? `${styles.active_header} ${styles.circle_icon}`
              : styles.circle_icon
          }
        >
          <img 
            src="/icons/chat_icon.png" 
            alt="Messages"
            className={styles.icon}
            width="20"
            height="20"
          />
          {user?.unseenMessages > 0 && (
            <div
              style={{
                transform: "translateY(3px)",
                right: "0px",
                top: "-5px",
              }}
              className={styles.notification}
            >
              {user?.unseenMessages}
            </div>
          )}
        </NavLink>
        <div ref={notificationmenu}>
          <div
            className={`${styles.circle_icon}  ${
              showNotificationMenu && styles.active_header
            }`}
            onClick={() => {
              setShowNotificationMenu((prev) => !prev);
            }}
          >
            <img 
              src="/icons/notifiblue.png" 
              alt="Notifications"
              className={styles.icon}
              width="20"
              height="20"
            />
            {user?.unseenNotification > 0 && (
              <div
                style={{
                  transform: "translateY(3px)",
                  right: "0px",
                  top: "-5px",
                }}
                className={styles.notification}
              >
                {user?.unseenNotification}
              </div>
            )}
          </div>

          {showNotificationMenu && (
            <NotificationMenu
              setShowNotificationMenu={setShowNotificationMenu}
              user={user}
            />
          )}
        </div>

        <div ref={usermenu}>
          <div
            className={`${styles.circle_icon}  ${
              showUserMenu && styles.active_header
            }`}
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <ArrowDown />
            </div>
          </div>

          {showUserMenu && (
            <UserMenu setShowUserMenu={setShowUserMenu} user={user} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
