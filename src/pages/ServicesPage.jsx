import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    window.scrollTo(0, 0);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setServices(response.data);
      } else {
        setServices(defaultServices);
      }
    } catch (err) {
      console.warn('Using default services list:', err);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const defaultServices = [
    {
      id: 1,
      title: 'Brand Strategy & Positioning',
      description: 'Foundational positioning, narrative frameworks, and brand architecture that create lasting market differentiation.',
      icon: '01',
      features: ['Positioning Framework', 'Brand Voice & Tone', 'Architecture & Naming', 'Audience Insights'],
    },
    {
      id: 2,
      title: 'Visual Identity & Systems',
      description: 'Distinctive, typography-driven visual design systems built on strategic foundations for physical and digital mediums.',
      icon: '02',
      features: ['Logo Suites & Marks', 'Typography Guidelines', 'Color Palette Systems', 'Brand Guidelines Book'],
    },
    {
      id: 3,
      title: 'Art Direction & Editorial Design',
      description: 'Creative guidance, magazine layout, print publication design, and visual storytelling executed with restraint and precision.',
      icon: '03',
      features: ['Editorial Publications', 'Print & Book Design', 'Photography Direction', 'Packaging & Collateral'],
    },
    {
      id: 4,
      title: 'Digital Systems & Web Direction',
      description: 'High-end responsive digital portfolio experiences, web layouts, and interactive visual direction.',
      icon: '04',
      features: ['Digital Design Systems', 'Web Layout & UI', 'Interactive Prototypes', 'Asset Production'],
    },
  ];

  return (
    <div style={styles.pageContainer}>
      <main style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.topNav}>
            <Link to="/" style={styles.backBtn}>
              &larr; Back to Portfolio
            </Link>
          </div>

          <div style={styles.header}>
            <span style={styles.monoCategory}>Capabilities Archive</span>
            <h1 style={styles.title}>All Design Services</h1>
            <p style={styles.subtitle}>
              Strategic design, brand identity, and art direction services tailored for ambitious brands and institutions.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading capabilities...</div>
          ) : (
            <div style={styles.servicesGrid}>
              {services.map((serv, idx) => (
                <div key={serv.id} style={styles.serviceCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.indexTag}>0{serv.display_order || idx + 1}</span>
                    <span style={styles.iconTag}>{serv.icon || '—'}</span>
                  </div>

                  <h2 style={styles.cardTitle}>{serv.title}</h2>
                  <p style={styles.cardDesc}>{serv.description}</p>

                  {Array.isArray(serv.features) && serv.features.length > 0 && (
                    <div style={styles.deliverablesSection}>
                      <span style={styles.deliverablesLabel}>Deliverables & Scope:</span>
                      <div style={styles.tagGrid}>
                        {serv.features.map((feat, i) => (
                          <span key={i} style={styles.tag}>
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={styles.cardActionRow}>
                    <Link to="/#contact" style={styles.inquireLink}>
                      Request Estimate for {serv.title.split(' ')[0]} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Process & Methodology Section */}
          <div style={styles.processSection}>
            <span style={styles.monoCategory}>Approach & Process</span>
            <h2 style={styles.processTitle}>How We Collaborate</h2>

            <div style={styles.processGrid}>
              <div style={styles.processStep}>
                <span style={styles.stepNum}>01</span>
                <h3 style={styles.stepTitle}>Discovery & Strategy</h3>
                <p style={styles.stepDesc}>
                  Understanding your audience, positioning goals, and competitive landscape.
                </p>
              </div>

              <div style={styles.processStep}>
                <span style={styles.stepNum}>02</span>
                <h3 style={styles.stepTitle}>Design & System</h3>
                <p style={styles.stepDesc}>
                  Developing distinctive visual concepts, typography, and brand frameworks.
                </p>
              </div>

              <div style={styles.processStep}>
                <span style={styles.stepNum}>03</span>
                <h3 style={styles.stepTitle}>Refinement & Delivery</h3>
                <p style={styles.stepDesc}>
                  Polishing all touchpoints and delivering production-ready brand assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-canvas)',
    color: 'var(--text-charcoal)',
    fontFamily: "var(--font-sans)",
  },
  mainContent: {
    padding: '40px 24px 100px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  topNav: {
    marginBottom: '36px',
  },
  backBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
  },
  header: {
    marginBottom: '56px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border-hairline)',
  },
  monoCategory: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--accent-bronze)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '6px',
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(40px, 6vw, 60px)',
    fontWeight: '400',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    maxWidth: '640px',
  },
  loadingBox: {
    padding: '60px',
    textAlign: 'center',
    fontFamily: "var(--font-mono)",
    color: 'var(--text-muted)',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    marginBottom: '80px',
  },
  serviceCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '12px',
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  indexTag: {
    fontFamily: "var(--font-mono)",
    fontSize: '13px',
    color: 'var(--accent-bronze)',
    fontWeight: '500',
  },
  iconTag: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '30px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 12px 0',
  },
  cardDesc: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    marginBottom: '24px',
  },
  deliverablesSection: {
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-hairline)',
    marginBottom: '20px',
  },
  deliverablesLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: '10px',
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    fontSize: '12px',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  cardActionRow: {
    paddingTop: '12px',
  },
  inquireLink: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--accent-bronze)',
    textDecoration: 'none',
    fontWeight: '500',
  },
  processSection: {
    padding: '48px 36px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '16px',
    border: '1px solid var(--border-hairline)',
  },
  processTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '36px',
    fontWeight: '400',
    marginBottom: '32px',
  },
  processGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '32px',
  },
  processStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stepNum: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--accent-bronze)',
    fontWeight: '500',
  },
  stepTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '24px',
    fontWeight: '400',
  },
  stepDesc: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
  },
};
