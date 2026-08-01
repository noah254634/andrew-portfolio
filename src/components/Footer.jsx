import { useState, useEffect } from 'react';
import api from '../api/axios';

const PROFILE_CACHE_KEY = 'swr_cached_profile';

export default function Footer() {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      return cached ? JSON.parse(cached) : {
        name: 'Andrew Wanjala',
        bio: 'Designer and brand strategist crafting distinctive identities with intention and restraint.',
        social_links: {
          instagram: 'https://instagram.com/wanjala9521',
          facebook: 'https://facebook.com/Andrew Wanjala',
          whatsapp: 'https://wa.me/254714513051',
          linkedin: '',
          behance: '',
          twitter: '',
        },
      };
    } catch (e) {
      return {
        name: 'Andrew Wanjala',
        bio: 'Designer and brand strategist crafting distinctive identities with intention and restraint.',
        social_links: {
          instagram: 'https://instagram.com/wanjala9521',
          facebook: 'https://facebook.com/wanjala9521',
          whatsapp: 'https://wa.me/254714513051',
          linkedin: '',
          behance: '',
          twitter: '',
        },
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
            bio: response.data.bio || prev.bio,
            social_links: response.data.social_links || prev.social_links,
          };
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(nextState));
          return nextState;
        });
      }
    } catch (err) {
      console.warn('Using default footer profile:', err);
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topGrid} className="footer-grid">
          {/* Left Bio Column */}
          <div style={styles.bioCol} className="footer-bio-col">
            <h3 style={styles.brandTitle}>{profile.name}</h3>
            <p style={styles.bioSummary}>{profile.bio}</p>
          </div>

          {/* Navigation Column */}
          <div style={styles.navCol}>
            <span style={styles.colTitle}>Navigation</span>
            <ul style={styles.linkList}>
              <li><a href="#works" className="footer-nav-link">Work</a></li>
              <li><a href="#about" className="footer-nav-link">About</a></li>
              <li><a href="#services" className="footer-nav-link">Services</a></li>
              <li><a href="#contact" className="footer-nav-link">Contact</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div style={styles.navCol}>
            <span style={styles.colTitle}>Connect</span>
            <ul style={styles.linkList}>
              {profile.social_links?.instagram && (
                <li>
                  <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>Instagram</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
              {profile.social_links?.facebook && (
                <li>
                  <a href={profile.social_links.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>Facebook</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
              {profile.social_links?.whatsapp && (
                <li>
                  <a href={profile.social_links.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>WhatsApp</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
              {profile.social_links?.linkedin && (
                <li>
                  <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>LinkedIn</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
              {profile.social_links?.twitter && (
                <li>
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>Twitter</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
              {profile.social_links?.behance && (
                <li>
                  <a href={profile.social_links.behance} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                    <span>Behance</span> <span className="social-arrow">&rarr;</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <span style={styles.copyright}>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <span style={styles.techText}>
            <a
              href="https://wa.me/254743657839"
              target="_blank"
              rel="noopener noreferrer"
              className="khaemba-badge"
              title="Need a fast, high-end website? Chat with Khaemba on WhatsApp"
            >
              <span className="khaemba-dot">●</span>
              <span className="khaemba-label">Website by <strong>Khaemba</strong></span>
              <span className="khaemba-arrow">↗</span>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    padding: '60px 20px 32px 20px',
    backgroundColor: 'var(--bg-canvas)',
    color: 'var(--text-charcoal)',
    borderTop: '1px solid var(--border-hairline)',
    fontFamily: "var(--font-sans)",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '36px',
  },
  bioCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    gridColumn: 'span 2',
  },
  brandTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '26px',
    fontWeight: '400',
    margin: 0,
  },
  bioSummary: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    maxWidth: '380px',
  },
  navCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  colTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    fontSize: '13px',
    color: 'var(--text-charcoal)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-hairline)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  techText: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  stealthLink: {
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease, opacity 0.2s ease',
  },
};

// Add footer mobile override
if (typeof document !== 'undefined' && !document.getElementById('footer-responsive')) {
  const style = document.createElement('style');
  style.id = 'footer-responsive';
  style.innerHTML = `
    @media (max-width: 640px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
      }
      .footer-bio-col {
        grid-column: span 1 !important;
      }
    }
    .footer-social-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--text-charcoal);
      font-size: 13px;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .footer-social-link .social-arrow {
      display: inline-block;
      color: var(--accent-bronze);
      transition: transform 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .footer-social-link:hover {
      color: var(--accent-bronze) !important;
      transform: translateX(5px);
    }
    .footer-social-link:hover .social-arrow {
      transform: translateX(4px);
    }
    .footer-nav-link {
      display: inline-block;
      color: var(--text-charcoal);
      font-size: 13px;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .footer-nav-link:hover {
      color: var(--accent-bronze) !important;
      transform: translateX(5px);
    }
    .khaemba-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 14px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-hairline);
      border-radius: 20px;
      color: var(--text-charcoal);
      font-family: var(--font-mono);
      font-size: 11px;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }
    .khaemba-dot {
      color: var(--accent-bronze);
      font-size: 8px;
      animation: khaembaPulse 2.4s infinite ease-in-out;
    }
    @keyframes khaembaPulse {
      0%, 100% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 4px var(--accent-bronze)); }
    }
    .khaemba-label strong {
      color: var(--accent-bronze);
      font-weight: 600;
    }
    .khaemba-arrow {
      font-size: 11px;
      color: var(--accent-bronze);
      transition: transform 0.2s ease;
    }
    .khaemba-badge:hover {
      border-color: var(--accent-bronze);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(197, 160, 89, 0.15);
      background-color: var(--bg-canvas);
    }
    .khaemba-badge:hover .khaemba-arrow {
      transform: translate(2px, -2px);
    }
  `;
  document.head.appendChild(style);
}
