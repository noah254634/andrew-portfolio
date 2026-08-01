import { useState, useEffect } from 'react';
import api, { formatImageUrl } from '../api/axios';

const PROFILE_CACHE_KEY = 'swr_cached_profile';

export default function AboutSection() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      return cached ? JSON.parse(cached) : {
        name: 'Andrew Wanjala',
        avatar_url: '',
        bio: 'With over a decade of experience working with brands across industries, I bring a strategic approach to every project. My work is rooted in the belief that the best brands are built on clarity, consistency, and restraint.',
      };
    } catch (e) {
      return {
        name: 'Andrew Wanjala',
        avatar_url: '',
        bio: 'With over a decade of experience working with brands across industries, I bring a strategic approach to every project. My work is rooted in the belief that the best brands are built on clarity, consistency, and restraint.',
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
          const nextState = {
            ...prev,
            name: response.data.name || prev.name,
            avatar_url: response.data.avatar_url || prev.avatar_url,
            bio: response.data.bio || prev.bio,
          };
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(nextState));
          return nextState;
        });
      }
    } catch (err) {
      console.warn('Using default about content:', err);
    }
  };

  return (
    <section id="about" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.contentCol}>
            <span style={styles.monoCategory}>Philosophy & Background</span>
            <blockquote style={styles.quoteBlock}>
              “Good design is invisible. It solves problems without drawing attention to itself.”
            </blockquote>

            <p style={styles.bioText}>{profile.bio}</p>

            <a href="#contact" style={styles.learnMoreBtn}>
              Learn more about my approach &rarr;
            </a>
          </div>

          <div style={styles.imageCol}>
            <div style={styles.frame}>
              {profile.avatar_url ? (
                <img
                  src={formatImageUrl(profile.avatar_url, 600)}
                  alt={profile.name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={styles.portraitImg}
                />
              ) : (
                <div style={styles.portraitPlaceholder}>
                  <span>{profile.name}</span>
                </div>
              )}
              <span style={styles.caption}>{profile.name} — Designer & Brand Strategist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '96px 24px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '64px',
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
    marginBottom: '16px',
  },
  quoteBlock: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: '400',
    lineHeight: '1.2',
    color: 'var(--text-charcoal)',
    marginBottom: '24px',
    fontStyle: 'italic',
  },
  bioText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'var(--text-muted)',
    marginBottom: '32px',
  },
  learnMoreBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: '13px',
    color: 'var(--accent-bronze)',
    textDecoration: 'none',
    fontWeight: '500',
  },
  imageCol: {
    justifySelf: 'center',
    maxWidth: '380px',
    width: '100%',
  },
  frame: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  portraitImg: {
    width: '100%',
    aspectRatio: '1/1',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  portraitPlaceholder: {
    width: '100%',
    aspectRatio: '1/1',
    backgroundColor: 'var(--bg-canvas)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "var(--font-serif)",
    fontSize: '24px',
    color: 'var(--text-muted)',
  },
  caption: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
};
