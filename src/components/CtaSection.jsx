export default function CtaSection() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Let’s create something meaningful.</h2>
          <p style={styles.subtitle}>
            Currently accepting new projects for Q1/Q2. I’d love to hear about what you’re building.
          </p>
          <a href="#contact" style={styles.ctaBtn}>
            Get an Estimate &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 24px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '16px',
    padding: '64px 36px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 'var(--card-shadow)',
  },
  heading: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: '400',
    lineHeight: '1.15',
    color: 'var(--text-charcoal)',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    maxWidth: '540px',
    marginBottom: '36px',
  },
  ctaBtn: {
    padding: '16px 36px',
    backgroundColor: 'var(--text-charcoal)',
    color: 'var(--bg-canvas)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    letterSpacing: '0.03em',
  },
};
