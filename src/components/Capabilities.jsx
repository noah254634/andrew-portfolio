import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Capabilities() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (Array.isArray(response.data)) {
        setServices(response.data);
      }
    } catch (err) {
      console.warn('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.monoCategory}>Capabilities & Offerings</span>
          <h2 style={styles.sectionTitle}>Creative Direction Services</h2>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading capabilities...</div>
        ) : services.length === 0 ? (
          <div style={styles.emptyBox}>No service offerings listed yet.</div>
        ) : (
          <div style={styles.grid}>
            {services.map((serv, idx) => (
              <div key={serv.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.indexBadge}>0{serv.display_order || idx + 1}</span>
                  <span style={styles.iconTag}>{serv.icon || '—'}</span>
                </div>

                <h3 style={styles.cardTitle}>{serv.title}</h3>
                <p style={styles.cardDescription}>{serv.description}</p>

                {Array.isArray(serv.features) && serv.features.length > 0 && (
                  <div style={styles.deliverablesBox}>
                    <span style={styles.deliverablesLabel}>Deliverables & Scope</span>
                    <div style={styles.tagList}>
                      {serv.features.map((feat, i) => (
                        <span key={i} style={styles.tag}>
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
  },
  monoCategory: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '4px',
  },
  sectionTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '38px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
  },
  loadingBox: {
    padding: '40px',
    textAlign: 'center',
    fontFamily: "var(--font-mono)",
    color: 'var(--text-muted)',
  },
  emptyBox: {
    padding: '48px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '10px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  indexBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--accent-bronze)',
    fontWeight: '500',
  },
  iconTag: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '26px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 10px 0',
  },
  cardDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  deliverablesBox: {
    marginTop: 'auto',
    borderTop: '1px solid var(--border-hairline)',
    paddingTop: '16px',
  },
  deliverablesLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: '8px',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    fontSize: '12px',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    padding: '3px 8px',
    borderRadius: '4px',
  },
};
