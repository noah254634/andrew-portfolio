import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Works', href: isHome ? '#works' : '/#works' },
    { label: 'Capabilities', href: '/services' },
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <header style={styles.headerContainer}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brandContainer}>
          <span style={styles.brandMonogram}>AW</span>
          <div>
            <h1 style={styles.brandTitle}>Andrew Wanjala</h1>
            <span style={styles.brandSubtitle}>Graphic Designer & Art Director</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-only" style={styles.linksContainer}>
          {navLinks.map((link) =>
            link.href.startsWith('/') ? (
              <Link key={link.label} to={link.href} style={styles.link}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} style={styles.link}>
                {link.label}
              </a>
            )
          )}
        </div>

        <div style={styles.rightActions}>
          <button
            onClick={toggleTheme}
            style={styles.themeToggleBtn}
            title="Toggle theme"
          >
            <span style={styles.themeDot}>◐</span>
            <span className="desktop-only">{theme === 'light' ? 'Obsidian Mode' : 'Porcelain Mode'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={styles.mobileMenuBtn}
            className="mobile-only"
            aria-label="Open Navigation"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Overlay */}
      {mobileMenuOpen && (
        <div style={styles.fullScreenMobileOverlay} className="mobile-only">
          <div style={styles.mobileHeaderRow}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={styles.brandContainer}>
              <span style={styles.brandMonogram}>AW</span>
              <div>
                <h2 style={styles.brandTitle}>Andrew Wanjala</h2>
                <span style={styles.brandSubtitle}>Graphic Designer & Art Director</span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              style={styles.mobileCloseBtn}
              aria-label="Close Navigation"
            >
              ✕
            </button>
          </div>

          <div style={styles.mobileLinksSection}>
            <span style={styles.mobileSectionTitle}>Navigation</span>
            <div style={styles.mobileLinksList}>
              {navLinks.map((link) =>
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>

          <div style={styles.mobileFooterSection}>
            <button onClick={toggleTheme} style={styles.mobileThemeBtn}>
              ◐ {theme === 'light' ? 'Obsidian Dark' : 'Porcelain Warm'} Mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  headerContainer: {
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "var(--font-sans)",
  },
  nav: {
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  brandMonogram: {
    width: '34px',
    height: '34px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent-bronze)',
    color: 'var(--accent-contrast)',
    fontFamily: "var(--font-serif)",
    fontWeight: '400',
    fontSize: '17px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '18px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
    lineHeight: '1.1',
  },
  brandSubtitle: {
    fontFamily: "var(--font-mono)",
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.02em',
    transition: 'color 0.15s ease',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  themeToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '6px',
    color: 'var(--text-charcoal)',
    fontSize: '12px',
    fontFamily: "var(--font-mono)",
    cursor: 'pointer',
  },
  themeDot: {
    color: 'var(--accent-bronze)',
    fontSize: '12px',
  },
  mobileMenuBtn: {
    padding: '8px 14px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '6px',
    color: 'var(--text-charcoal)',
    fontSize: '18px',
    cursor: 'pointer',
  },
  fullScreenMobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-canvas)',
    color: 'var(--text-charcoal)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    overflowY: 'auto',
  },
  mobileHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-hairline)',
  },
  mobileCloseBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  mobileLinksSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '36px 0',
  },
  mobileSectionTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  mobileLinksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileLink: {
    padding: '16px 20px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    textDecoration: 'none',
    fontSize: '22px',
    fontFamily: "var(--font-serif)",
    fontWeight: '400',
  },
  mobileFooterSection: {
    borderTop: '1px solid var(--border-hairline)',
    paddingTop: '20px',
  },
  mobileThemeBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '6px',
    color: 'var(--text-charcoal)',
    fontFamily: "var(--font-mono)",
    fontSize: '13px',
    cursor: 'pointer',
  },
};
