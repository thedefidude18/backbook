import styles from './CreateChallengeForm.module.css';

// Update className references in your component:
<form onSubmit={handleSubmit} className={styles.form}>
  <div className={styles.inputGroup}>
    <label className={styles.label}>
      Challenge Title
    </label>
    <input
      type="text"
      className={styles.input}
      // ... other props
    />
  </div>

  <div className={styles.searchContainer}>
    <Search className={styles.searchIcon} />
    <input
      type="text"
      className={styles.searchInput}
      // ... other props
    />
  </div>

  {users.length > 0 && (
    <div className={styles.searchResults}>
      {users.map((user) => (
        <button
          key={user.id}
          className={styles.userCard}
          // ... other props
        >
          <img
            src={user.avatar_url}
            alt={user.name}
            className={styles.userAvatar}
          />
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{user.name}</h3>
            <p className={styles.userHandle}>@{user.username}</p>
          </div>
        </button>
      ))}
    </div>
  )}

  {/* Continue updating other elements with their corresponding style classes */}