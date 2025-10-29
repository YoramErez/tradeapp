import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './MatchesPage.module.css';

interface Match {
  id: string;
  status: string;
  userA: {
    id: string;
    name: string;
    avatarURL?: string | null;
    city?: string | null;
    country?: string | null;
  };
  userB: {
    id: string;
    name: string;
    avatarURL?: string | null;
    city?: string | null;
    country?: string | null;
  };
  listingA: {
    id: string;
    title: string;
    photoURLs: string[];
  } | null;
  listingB: {
    id: string;
    title: string;
    photoURLs: string[];
  } | null;
}

export default function MatchesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await matchesApi.getMyMatches();
      return response.data as Match[];
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (matchId: string) => matchesApi.acceptMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (matchId: string) => matchesApi.declineMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  const getOtherUser = (match: Match) => {
    return match.userA.id === user?.id ? match.userB : match.userA;
  };

  const getMyListing = (match: Match) => {
    return match.userA.id === user?.id ? match.listingA : match.listingB;
  };

  const getTheirListing = (match: Match) => {
    return match.userA.id === user?.id ? match.listingB : match.listingA;
  };

  const getPhotoURLs = (photoURLs: string[]) => {
    return photoURLs || [];
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load matches. Please try again.</div>
      </div>
    );
  }

  const matches = data || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Matches</h1>
      
      {matches.length === 0 ? (
        <div className={styles.empty}>
          <p>No matches yet.</p>
          <p>Start swiping to find potential trades!</p>
        </div>
      ) : (
        <div className={styles.matchesGrid}>
          {matches.map((match) => {
            const otherUser = getOtherUser(match);
            const myListing = getMyListing(match);
            const theirListing = getTheirListing(match);
            const myPhotos = myListing ? getPhotoURLs(myListing.photoURLs) : [];
            const theirPhotos = theirListing ? getPhotoURLs(theirListing.photoURLs) : [];

            return (
              <div key={match.id} className={styles.matchCard}>
                <div className={styles.matchHeader}>
                  <div className={styles.userInfo}>
                    {otherUser.avatarURL ? (
                      <img src={otherUser.avatarURL} alt={otherUser.name} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>{otherUser.name[0]}</div>
                    )}
                    <div>
                      <h3 className={styles.userName}>{otherUser.name}</h3>
                      {(otherUser.city || otherUser.country) && (
                        <p className={styles.userLocation}>
                          {[otherUser.city, otherUser.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`${styles.status} ${styles[`status_${match.status}`]}`}>
                    {match.status}
                  </span>
                </div>

                <div className={styles.listingsContainer}>
                  <div className={styles.listingCard}>
                    <h4 className={styles.listingTitle}>Your Item</h4>
                    {myListing && (
                      <>
                        {myPhotos.length > 0 ? (
                          <img src={myPhotos[0]} alt={myListing.title} className={styles.listingImage} />
                        ) : (
                          <div className={styles.noImage}>📷</div>
                        )}
                        <p className={styles.listingName}>{myListing.title}</p>
                      </>
                    )}
                  </div>

                  <div className={styles.swapArrow}>⇄</div>

                  <div className={styles.listingCard}>
                    <h4 className={styles.listingTitle}>Their Item</h4>
                    {theirListing && (
                      <>
                        {theirPhotos.length > 0 ? (
                          <img src={theirPhotos[0]} alt={theirListing.title} className={styles.listingImage} />
                        ) : (
                          <div className={styles.noImage}>📷</div>
                        )}
                        <p className={styles.listingName}>{theirListing.title}</p>
                      </>
                    )}
                  </div>
                </div>

                {match.status === 'pending' && (
                  <div className={styles.actions}>
                    <button
                      className={`${styles.button} ${styles.acceptButton}`}
                      onClick={() => acceptMutation.mutate(match.id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                    >
                      Accept Match
                    </button>
                    <button
                      className={`${styles.button} ${styles.declineButton}`}
                      onClick={() => declineMutation.mutate(match.id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                    >
                      Decline
                    </button>
                  </div>
                )}

                {match.status === 'accepted' && (
                  <div className={styles.acceptedBadge}>
                    ✓ Match Accepted
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

