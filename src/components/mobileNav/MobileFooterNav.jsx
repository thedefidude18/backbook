import styles from "./MobileFooterNav.module.css";

export default function MobileFooterNav({ user }) {
  return (
    <div className={styles.mobile_footer_nav}>
      <div style={{color: 'white'}}>Home</div>
      <div style={{color: 'white'}}>Friends</div>
      <div style={{color: 'white'}}>Create</div>
      <div style={{color: 'white'}}>Messages</div>
      <div style={{color: 'white'}}>Profile</div>
    </div>
  );
}
