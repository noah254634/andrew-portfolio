import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProjectDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
      setError('Project case study not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <main style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.topNav}>
            <Link to="/" style={styles.backBtn}>
              &larr; Back to Selected Works
            </Link>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading case study...</div>
          ) : error || !project ? (
            <div style={styles.errorBox}>
              <p>{error || 'Project not found.'}</p>
              <Link to="/" style={styles.homeLink}>
                Return to Home &rarr;
              </Link>
            </div>
          ) : (
            <article style={styles.article}>
              {/* Header Meta */}
              <div style={styles.header}>
                <div style={styles.metaRow}>
                  <span style={styles.categoryBadge}>{project.category || 'Brand Identity'}</span>
                  <span style={styles.yearText}>Year {project.year}</span>
                </div>

                <h1 style={styles.title}>{project.title}</h1>
                <p style={styles.summary}>{project.summary}</p>
              </div>

              {/* Cover Image Frame */}
              {project.cover_image_url && (
                <div style={styles.coverFrame}>
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    style={styles.coverImg}
                  />
                </div>
              )}

              {/* Case Study Details Grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Client & Discipline</span>
                  <p style={styles.detailVal}>{project.title} — {project.category}</p>
                </div>

                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Timeline</span>
                  <p style={styles.detailVal}>{project.year}</p>
                </div>

                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Core Deliverables</span>
                  <p style={styles.detailVal}>Brand System, Typography Guidelines, Art Direction</p>
                </div>
              </div>

              {/* Narrative Content */}
              <div style={styles.narrativeSection}>
                <h2 style={styles.sectionHeading}>Design Overview & Strategy</h2>
                <p style={styles.paragraph}>
                  This project embodies a strategic approach to brand identity, focusing on visual clarity, restraint, and distinctive typography. Every element was crafted to create lasting differentiation and seamless touchpoints across physical and digital mediums.
                </p>
              </div>

              {/* Bottom Navigation */}
              <div style={styles.bottomNav}>
                <Link to="/" style={styles.primaryBackBtn}>
                  Explore All Selected Works &rarr;
                </Link>
              </div>
            </article>
          )}
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  topNav: {
    marginBottom: '40px',
  },
  backBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
  },
  loadingBox: {
    padding: '60px',
    textAlign: 'center',
    fontFamily: "var(--font-mono)",
    color: 'var(--text-muted)',
  },
  errorBox: {
    padding: '60px',
    textAlign: 'center',
  },
  homeLink: {
    color: 'var(--accent-bronze)',
    fontSize: '14px',
    marginTop: '16px',
    display: 'inline-block',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--accent-bronze)',
    backgroundColor: 'var(--badge-bg)',
    padding: '4px 10px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  yearText: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(40px, 6vw, 64px)',
    fontWeight: '400',
    lineHeight: '1.1',
    margin: 0,
  },
  summary: {
    fontSize: '18px',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    maxWidth: '720px',
  },
  coverFrame: {
    width: '100%',
    maxHeight: '540px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-hairline)',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    padding: '32px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
    border: '1px solid var(--border-hairline)',
  },
  detailCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  detailVal: {
    fontSize: '14px',
    color: 'var(--text-charcoal)',
    fontWeight: '500',
  },
  narrativeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '20px',
  },
  sectionHeading: {
    fontFamily: "var(--font-serif)",
    fontSize: '32px',
    fontWeight: '400',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'var(--text-muted)',
  },
  bottomNav: {
    paddingTop: '40px',
    borderTop: '1px solid var(--border-hairline)',
    textAlign: 'center',
  },
  primaryBackBtn: {
    padding: '14px 28px',
    backgroundColor: 'var(--text-charcoal)',
    color: 'var(--bg-canvas)',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
  },
};
