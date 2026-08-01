import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { formatImageUrl } from '../api/axios';

const CACHE_KEY = 'swr_cached_reviews';

export default function ReviewsSection() {
  // Stale-While-Revalidate (SWR): Initialize state from localStorage for instant 0ms mount
  const [reviews, setReviews] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(() => reviews.length === 0);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-play timer: slides testimonial cards automatically every 4 seconds
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [reviews, isPaused]);

  // Preload all reviewer avatars into browser memory cache for 0ms slide transitions
  useEffect(() => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      reviews.forEach((r) => {
        if (r.client_avatar) {
          const img = new Image();
          img.src = formatImageUrl(r.client_avatar, 150);
        }
      });
    }
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setReviews(response.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
      }
    } catch (err) {
      console.warn('Failed to load reviews from API:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextReview = () => {
    if (reviews.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (!loading && reviews.length === 0) {
    return null; // Cleanly hide if no reviews exist in DB
  }

  const activeReview = reviews[activeIndex] || reviews[0];

  const slideVariants = {
    initial: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
    }),
  };

  return (
    <section
      id="reviews"
      style={styles.section}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={styles.container}>
        {/* Clean Section Header */}
        <div style={styles.headerRow}>
          <div>
            <span style={styles.monoCategory}>Client Endorsements</span>
            <h2 style={styles.sectionTitle}>What Clients Say</h2>
          </div>

          {reviews.length > 1 && (
            <div style={styles.rightHeaderBox}>
              <span style={styles.motionBadge}>
                <span style={{ ...styles.motionDot, opacity: isPaused ? 0.4 : 1 }}></span>
                {isPaused ? 'Paused' : 'Auto Sliding'}
              </span>

              <div style={styles.navControls}>
                <button onClick={prevReview} style={styles.arrowBtn} aria-label="Previous Testimonial">
                  &larr;
                </button>
                <span style={styles.counterText}>
                  0{activeIndex + 1} / 0{reviews.length}
                </span>
                <button onClick={nextReview} style={styles.arrowBtn} aria-label="Next Testimonial">
                  &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Auto-Sliding Featured Showcase Card or Skeleton Loader */}
        <div style={styles.cardWrapper}>
          {loading && reviews.length === 0 ? (
            <div style={styles.skeletonFeaturedCard}>
              <div style={styles.skeletonStars} />
              <div style={styles.skeletonQuote} />
              <div style={styles.skeletonQuoteSub} />
              <div style={styles.skeletonProfile} />
            </div>
          ) : (
            <AnimatePresence custom={direction} mode="wait">
              {activeReview && (
                <motion.div
                  key={activeReview.id || activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={styles.featuredCard}
                >
                  {/* Rating Stars & Project Tag */}
                  <div style={styles.ratingRow}>
                    <div style={styles.stars}>
                      {'★'.repeat(activeReview.rating || 5).split('').map((star, i) => (
                        <span key={i} style={styles.starSymbol}>{star}</span>
                      ))}
                    </div>
                    {activeReview.project_tag && (
                      <span style={styles.projectBadge}>{activeReview.project_tag}</span>
                    )}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote style={styles.quoteBlock}>
                    “{activeReview.content}”
                  </blockquote>

                  {/* Client Profile & Slide Dots */}
                  <div style={styles.clientFooterRow}>
                    <div style={styles.clientProfile}>
                      {activeReview.client_avatar ? (
                        <img
                          src={formatImageUrl(activeReview.client_avatar, 150)}
                          alt={activeReview.client_name}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                          style={styles.avatarImg}
                        />
                      ) : (
                        <div style={styles.avatarPlaceholder}>
                          {activeReview.client_name?.charAt(0) || 'C'}
                        </div>
                      )}
                      <div style={styles.clientMetaText}>
                        <h4 style={styles.clientName}>{activeReview.client_name}</h4>
                        <p style={styles.clientRole}>
                          {activeReview.client_role}
                          {activeReview.company_name && ` — ${activeReview.company_name}`}
                        </p>
                      </div>
                    </div>

                    {reviews.length > 1 && (
                      <div style={styles.dotIndicators}>
                        {reviews.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setDirection(idx > activeIndex ? 1 : -1);
                              setActiveIndex(idx);
                            }}
                            style={{
                              ...styles.dot,
                              ...(activeIndex === idx ? styles.dotActive : {}),
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Supporting Mini Cards */}
        {reviews.length > 1 && (
          <div style={styles.secondaryGrid}>
            {reviews.map((rev, idx) => {
              if (idx === activeIndex) return null;
              return (
                <motion.div
                  key={rev.id || idx}
                  whileHover={{ scale: 1.01, translateY: -1 }}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  style={styles.miniCard}
                >
                  <div style={styles.miniHeader}>
                    <span style={styles.miniName}>{rev.client_name}</span>
                    <span style={styles.miniRating}>{'★'.repeat(rev.rating || 5)}</span>
                  </div>
                  <p style={styles.miniQuote}>
                    “{rev.content.length > 85 ? `${rev.content.substring(0, 85)}...` : rev.content}”
                  </p>
                  <span style={styles.miniCompany}>{rev.company_name || rev.client_role}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '64px 24px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-hairline)',
  },
  monoCategory: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--accent-bronze)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '4px',
  },
  sectionTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '36px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  rightHeaderBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  motionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  motionDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  navControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  arrowBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  counterText: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  cardWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    width: '100%',
  },
  featuredCard: {
    width: '100%',
    maxWidth: '780px',
    margin: '0 auto',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '14px',
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
  },
  stars: {
    display: 'flex',
    gap: '3px',
    justifyContent: 'center',
  },
  starSymbol: {
    color: 'var(--accent-bronze)',
    fontSize: '15px',
  },
  projectBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    padding: '3px 10px',
    borderRadius: '12px',
  },
  quoteBlock: {
    fontFamily: "var(--font-serif)",
    fontSize: '21px',
    fontWeight: '400',
    lineHeight: '1.5',
    color: 'var(--text-charcoal)',
    margin: '0 auto 24px auto',
    maxWidth: '680px',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  clientFooterRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    borderTop: '1px solid var(--border-hairline)',
    paddingTop: '18px',
  },
  clientProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  clientMetaText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  avatarImg: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--accent-bronze)',
  },
  avatarPlaceholder: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-bronze)',
    color: 'var(--accent-contrast)',
    fontFamily: "var(--font-serif)",
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: {
    fontFamily: "var(--font-serif)",
    fontSize: '18px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
    lineHeight: '1.2',
  },
  clientRole: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
    margin: '2px 0 0 0',
  },
  dotIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '4px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--border-hairline)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.2s ease',
  },
  dotActive: {
    backgroundColor: 'var(--accent-bronze)',
    width: '18px',
    borderRadius: '3px',
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    maxWidth: '780px',
    margin: '0 auto',
  },
  miniCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '8px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',
  },
  miniHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  miniName: {
    fontFamily: "var(--font-serif)",
    fontSize: '14px',
    color: 'var(--text-charcoal)',
    fontWeight: '400',
  },
  miniRating: {
    color: 'var(--accent-bronze)',
    fontSize: '11px',
  },
  miniQuote: {
    fontFamily: "var(--font-sans)",
    fontSize: '12px',
    lineHeight: '1.45',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    margin: '0 0 8px 0',
  },
  miniCompany: {
    fontFamily: "var(--font-mono)",
    fontSize: '9.5px',
    color: 'var(--accent-bronze)',
    marginTop: 'auto',
  },
  skeletonFeaturedCard: {
    width: '100%',
    maxWidth: '780px',
    height: '240px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '14px',
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    opacity: 0.6,
  },
  skeletonStars: {
    width: '120px',
    height: '16px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
  skeletonQuote: {
    width: '80%',
    height: '20px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
  skeletonQuoteSub: {
    width: '50%',
    height: '18px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
  skeletonProfile: {
    width: '140px',
    height: '36px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '20px',
    marginTop: '12px',
  },
};
