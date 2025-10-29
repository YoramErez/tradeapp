import { useState, useEffect } from 'react';
import { listingsApi } from '../../lib/api';
import styles from './SwipePage.module.css';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  photoURLs: string[];
  owner?: {
    name: string;
    avatarURL?: string | null;
  };
}

export default function SwipePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await listingsApi.getAvailableListings();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= items.length) return;

    const item = items[currentIndex];
    
    if (direction === 'right') {
      // Like the item
      try {
        await listingsApi.likeItem(item.id);
        setSwipeDirection('right');
      } catch (error) {
        console.error('Failed to like item:', error);
      }
    } else {
      setSwipeDirection('left');
    }

    // Move to next item after animation
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
    }, 400);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = () => {
    if (!isDragging) return;
    // Handle drag logic if needed
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const endX = e.clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? 'right' : 'left');
    }
    
    setIsDragging(false);
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No items to swipe</h2>
          <p className={styles.emptyText}>Check back later for new items!</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= items.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎉</div>
          <h2 className={styles.emptyTitle}>All caught up!</h2>
          <p className={styles.emptyText}>You've seen all available items</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  return (
    <div className={styles.container}>
      <div className={styles.swipeContainer}>
        <div className={styles.cardStack}>
          {nextItem && (
            <div className={styles.card}>
              {nextItem.photoURLs && nextItem.photoURLs.length > 0 ? (
                <img src={nextItem.photoURLs[0]} alt={nextItem.title} className={styles.cardImage} />
              ) : (
                <div className={styles.noImageContainer}>
                  <span className={styles.noImageText}>📷</span>
                </div>
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{nextItem.title}</h3>
                  <span className={styles.category}>{nextItem.category}</span>
                </div>
                <p className={styles.cardDescription}>{nextItem.description}</p>
                <div className={styles.cardOwner}>
                  {nextItem.owner?.avatarURL && (
                    <img src={nextItem.owner.avatarURL} alt={nextItem.owner.name} className={styles.ownerAvatar} />
                  )}
                  <span className={styles.ownerName}>{nextItem.owner?.name}</span>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className={`${styles.card} ${swipeDirection === 'left' ? styles.swipeLeft : ''} ${swipeDirection === 'right' ? styles.swipeRight : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
          >
            {currentItem.photoURLs && currentItem.photoURLs.length > 0 ? (
              <img src={currentItem.photoURLs[0]} alt={currentItem.title} className={styles.cardImage} />
            ) : (
              <div className={styles.noImageContainer}>
                <span className={styles.noImageText}>📷</span>
              </div>
            )}
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{currentItem.title}</h3>
                <span className={styles.category}>{currentItem.category}</span>
              </div>
              <p className={styles.cardDescription}>{currentItem.description}</p>
              <div className={styles.cardOwner}>
                {currentItem.owner?.avatarURL && (
                  <img src={currentItem.owner.avatarURL} alt={currentItem.owner.name} className={styles.ownerAvatar} />
                )}
                <span className={styles.ownerName}>{currentItem.owner?.name}</span>
              </div>
            </div>
            
            {swipeDirection && (
              <div className={styles.overlay}>
                <div className={`${styles.overlayText} ${swipeDirection === 'right' ? styles.overlayLike : styles.overlayPass}`}>
                  {swipeDirection === 'right' ? '✓ LIKE' : '✗ PASS'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => handleSwipe('left')}
            className={`${styles.actionButton} ${styles.dislikeButton}`}
          >
            <svg className={`${styles.actionIcon} ${styles.dislikeIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className={`${styles.actionButton} ${styles.likeButton}`}
          >
            <svg className={styles.actionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

