import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ServicesSection() {
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Brand Strategy',
      description: 'Positioning and narrative frameworks that create lasting differentiation.',
      icon: '01',
      features: ['Positioning', 'Brand Voice', 'Architecture'],
    },
    {
      id: 2,
      title: 'Visual Identity',
      description: 'Distinctive design systems built on strategic foundations.',
      icon: '02',
      features: ['Logo Systems', 'Typography', 'Color Palettes'],
    },
    {
      id: 3,
      title: 'Art Direction',
      description: 'Creative guidance that brings brand visions to life with precision.',
      icon: '03',
      features: ['Editorial', 'Photography', 'Packaging'],
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setServices(response.data);
      }
    } catch (err) {
      console.warn('Using default services content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <span style={styles.monoCategory}>Services</span>
            <h2 style={styles.sectionTitle}>What I Do</h2>
          </div>

          <Link to="/services" style={styles.viewAllBtn}>
            View All Services &rarr;
          </Link>
        </div>

        <div style={styles.grid}>
          {services.map((serv, idx) => (
            <div key={serv.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.indexTag}>0{serv.display_order || idx + 1}</span>
                <span style={styles.iconTag}>{serv.icon || '—'}</span>
              </div>

              <h3 style={styles.cardTitle}>{serv.title}</h3>
              <p style={styles.cardDescription}>{serv.description}</p>

              {Array.isArray(serv.features) && serv.features.length > 0 && (
                <div style={styles.deliverablesBox}>
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
  headerRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '48px',
    flexWrap: 'wrap',
    gap: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-hairline)',
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
    fontSize: '44px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
  },
  viewAllBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--accent-bronze)',
    textDecoration: 'none',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '28px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '12px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  indexTag: {
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
    fontSize: '28px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 12px 0',
  },
  cardDescription: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    marginBottom: '24px',
  },
  deliverablesBox: {
    marginTop: 'auto',
    borderTop: '1px solid var(--border-hairline)',
    paddingTop: '16px',
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
