import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { formatImageUrl } from '../api/axios';
import StarfieldCanvas from './StarfieldCanvas';

const PROFILE_CACHE_KEY = 'swr_cached_profile';

export default function Hero() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      return cached ? JSON.parse(cached) : {
        name: 'Andrew Wanjala',
        title: 'Senior Graphic Designer & Art Director',
        bio: 'Specializing in typography-driven brand identities, editorial publications, and minimalist visual systems for design-forward clients.',
        avatar_url: '',
        cv_url: '',
        availability_status: 'Available for Q1/Q2 Commissions',
        location: 'Nairobi, Kenya / Global Remote',
      };
    } catch (e) {
      return {
        name: 'Andrew Wanjala',
        title: 'Senior Graphic Designer & Art Director',
        bio: 'Specializing in typography-driven brand identities, editorial publications, and minimalist visual systems for design-forward clients.',
        avatar_url: '',
        cv_url: '',
        availability_status: 'Available for Q1/Q2 Commissions',
        location: 'Nairobi, Kenya / Global Remote',
      };
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setProfile((prev) => {
          const nextState = { ...prev, ...response.data };
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(nextState));
          return nextState;
        });
      }
    } catch (err) {
      console.warn('Using default profile content:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  return (
    <section id="about" className="hero-section" style={styles.heroSection}>
      <StarfieldCanvas />
      <motion.div
        style={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Status Meta */}
        <motion.div style={styles.metaRow} variants={itemVariants}>
          {profile.availability_status && (
            <span style={styles.availabilityBadge}>
              <span style={styles.dot}>●</span> {profile.availability_status}
            </span>
          )}
          {profile.location && (
            <span style={styles.locationText}>{profile.location}</span>
          )}
        </motion.div>

        {/* Editorial Hero Layout */}
        <div style={styles.mainGrid}>
          <motion.div style={styles.contentCol} variants={itemVariants}>
            <span style={styles.monoCategory}>{profile.title || 'Senior Graphic Designer & Art Director'}</span>

            <h1 style={styles.editorialHeading}>
              Crafting <em style={styles.serifItalic}>timeless</em> brand identities & visual systems.
            </h1>

            <p style={styles.bioText}>{profile.bio}</p>

            <div style={styles.actionRow} className="mobile-action-row">
              {profile.cv_url && (
                <motion.button
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={async () => {
                    try {
                      const response = await fetch(profile.cv_url);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${profile.name.replace(/\s+/g, '_')}_CV.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      const link = document.createElement('a');
                      link.href = profile.cv_url;
                      link.download = 'Andrew_Wanjala_CV.pdf';
                      link.target = '_blank';
                      link.click();
                    }
                  }}
                  style={styles.primaryBtn}
                  className="btn-responsive"
                >
                  Download Curriculum Vitae (PDF) &darr;
                </motion.button>
              )}
              <motion.a
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                href="#contact"
                style={styles.secondaryBtn}
                className="btn-responsive"
              >
                Start Project Inquiry &rarr;
              </motion.a>
            </div>
          </motion.div>

          {profile.avatar_url && (
            <motion.div style={styles.imageCol} variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                style={styles.frame}
              >
                <img
                  src={formatImageUrl(profile.avatar_url, 600)}
                  alt={profile.name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={styles.avatarImg}
                />
                <span style={styles.caption}>Portrait / {profile.name}</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    padding: '48px 20px 64px 20px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-accent)',
    boxShadow: '0 1px 0 0 var(--border-hairline)',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  availabilityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'var(--text-charcoal)',
  },
  dot: {
    color: '#10b981',
    fontSize: '9px',
  },
  locationText: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  contentCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  monoCategory: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--accent-bronze)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },
  editorialHeading: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(36px, 6vw, 76px)',
    fontWeight: '400',
    lineHeight: '1.08',
    color: 'var(--text-charcoal)',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
  },
  serifItalic: {
    fontStyle: 'italic',
    color: 'var(--accent-bronze)',
  },
  bioText: {
    fontSize: '16.5px',
    fontWeight: '400',
    lineHeight: '1.75',
    color: 'var(--text-charcoal)',
    opacity: 0.88,
    marginBottom: '32px',
    maxWidth: '600px',
    letterSpacing: '-0.005em',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '12px 24px',
    backgroundColor: 'var(--accent-bronze)',
    color: 'var(--accent-contrast)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    letterSpacing: '0.02em',
    textAlign: 'center',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '12px 24px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center',
  },
  imageCol: {
    justifySelf: 'center',
    maxWidth: '360px',
    width: '100%',
  },
  frame: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  avatarImg: {
    width: '100%',
    aspectRatio: '1/1',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  caption: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
};

// Add responsive mobile overrides
if (typeof document !== 'undefined' && !document.getElementById('hero-responsive')) {
  const style = document.createElement('style');
  style.id = 'hero-responsive';
  style.innerHTML = `
    @media (max-width: 640px) {
      .mobile-action-row {
        flex-direction: column !important;
        width: 100% !important;
      }
      .btn-responsive {
        width: 100% !important;
        display: block !important;
      }
    }
  `;
  document.head.appendChild(style);
}
