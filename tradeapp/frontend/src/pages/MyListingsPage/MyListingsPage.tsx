import { useState, useEffect } from 'react';
import { listingsApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import styles from './MyListingsPage.module.css';

export default function MyListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data } = await listingsApi.getMyListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingsApi.deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>My Listings</h1>
            <p className={styles.subtitle}>Manage your items</p>
          </div>
          <button
            onClick={() => navigate('/create-listing')}
            className={styles.createButton}
          >
            + Create Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No listings yet</h3>
            <p className={styles.emptyText}>Create your first listing to get started</p>
            <button
              onClick={() => navigate('/create-listing')}
              className={styles.emptyButton}
            >
              Create Listing
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                {listing.photoURLs && listing.photoURLs.length > 0 ? (
                  <img
                    src={listing.photoURLs[0]}
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
                  
                  <div className={styles.cardTags}>
                    <span className={styles.category}>{listing.category}</span>
                    <span className={styles.status}>{listing.status}</span>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
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
