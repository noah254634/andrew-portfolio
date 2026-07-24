import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Hero() {
  const [profile, setProfile] = useState({
    name: 'Andrew Wanjala',
    title: 'Senior Graphic Designer & Art Director',
    bio: 'Specializing in typography-driven brand identities, editorial publications, and minimalist visual systems for design-forward clients.',
    avatar_url: '',
    cv_url: '',
    availability_status: 'Available for Q1/Q2 Commissions',
    location: 'Nairobi, Kenya / Global Remote',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data && response.data.name) {
        setProfile(response.data);
      }
    } catch (err) {
      console.warn('Using default profile content:', err);
    }
  };

  return (
    <section id="about" className="hero-section" style={styles.heroSection}>
      <div style={styles.container}>
        {/* Top Status Meta */}
        <div style={styles.metaRow}>
          <span style={styles.availabilityBadge}>
            <span style={styles.dot}>●</span> {profile.availability_status}
          </span>
          <span style={styles.locationText}>{profile.location}</span>
        </div>

        {/* Editorial Hero Layout */}
        <div style={styles.mainGrid}>
          <div style={styles.contentCol}>
            <span style={styles.monoCategory}>{profile.title}</span>
            
            <h1 style={styles.editorialHeading}>
              Crafting <em style={styles.serifItalic}>timeless</em> brand identities & visual systems.
            </h1>

            <p style={styles.bioText}>{profile.bio}</p>

            <div style={styles.actionRow} className="mobile-action-row">
              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.primaryBtn}
                  className="btn-responsive"
                >
                  Curriculum Vitae (PDF) &rarr;
                </a>
              )}
              <a href="#contact" style={styles.secondaryBtn} className="btn-responsive">
                Start Project Inquiry &rarr;
              </a>
            </div>
          </div>

          {profile.avatar_url && (
            <div style={styles.imageCol}>
              <div style={styles.frame}>
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  style={styles.avatarImg}
                />
                <span style={styles.caption}>Portrait / {profile.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  heroSection: {
    padding: '48px 20px 64px 20px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
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
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    marginBottom: '32px',
    maxWidth: '580px',
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
