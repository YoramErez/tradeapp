import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>TradeSub</h1>
          <p className={styles.welcomeText}>Peer-to-peer item trading</p>
          <button
            onClick={() => navigate('/login')}
            className={styles.startButton}
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <h1 className={styles.logo}>TradeSub</h1>
            <div className={styles.userInfo}>
              <span className={styles.username}>Hello, {user.name}</span>
              <button
                onClick={logout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome back!</h2>
          <p className={styles.description}>You're logged in as {user.email}</p>
          
          <div className={styles.grid}>
            <button
              onClick={() => navigate('/listings')}
              className={`${styles.gridItem} ${styles.gridItemPrimary}`}
            >
              <h3 className={styles.gridItemTitle}>Browse Listings</h3>
              <p className={styles.gridItemText}>Discover items to trade</p>
            </button>
            
            <button
              onClick={() => navigate('/my-listings')}
              className={`${styles.gridItem} ${styles.gridItemGreen}`}
            >
              <h3 className={styles.gridItemTitle}>My Listings</h3>
              <p className={styles.gridItemText}>Manage your items</p>
            </button>
            
            <button
              onClick={() => navigate('/swipe')}
              className={`${styles.gridItem} ${styles.gridItemYellow}`}
            >
              <h3 className={styles.gridItemTitle}>Swipe</h3>
              <p className={styles.gridItemText}>Find trading partners</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
