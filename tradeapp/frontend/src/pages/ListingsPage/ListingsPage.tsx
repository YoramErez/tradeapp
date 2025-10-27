import { useState, useEffect } from 'react';
import { listingsApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import styles from './ListingsPage.module.css';

export default function ListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data } = await listingsApi.getAvailableListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Browse Items</h1>
          <p className={styles.subtitle}>Discover items available for trade</p>
        </div>

        {listings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No items available</h3>
            <p className={styles.emptyText}>Check back later for new listings</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <div
                key={listing.id}
                className={styles.card}
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                {listing.photoURLs ? (
                  <img
                    src={listing.photoURLs}
                    alt={listing.title}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.noImageContainer}>
                    <span className={styles.noImageText}>No image</span>
                  </div>
                )}
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.cardDescription}>{listing.description}</p>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.category}>{listing.category}</span>
                    <span className={styles.owner}>{listing.owner?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
