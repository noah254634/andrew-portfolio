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

  const isVideo = (url, contentType) => {
    if (contentType && contentType.startsWith('video/')) return true;
    if (url && /\.(mp4|webm|mov|m4v|ogv)$/i.test(url)) return true;
    return false;
  };

  const renderCoverMedia = (url, contentType, title) => {
    if (isVideo(url, contentType)) {
      return (
        <video
          src={url}
          controls
          preload="metadata"
          style={styles.coverVideo}
        />
      );
    }
    return <img src={url} alt={title} style={styles.coverImg} />;
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

              {/* High-End Cinema Frame */}
              {(project.video_url || project.cover_image_url) && (
                <div style={styles.heroStage}>
                  <div style={styles.coverFrame}>
                    {project.video_url ? (
                      <video
                        src={project.video_url}
                        poster={project.cover_image_url || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        style={styles.coverVideo}
                      />
                    ) : (
                      renderCoverMedia(
                        project.cover_image_url,
                        project.cover_content_type,
                        project.title
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Case Study Details Grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Client & Discipline</span>
                  <p style={styles.detailVal}>
                    {project.client_name || project.title} — {project.category}
                  </p>
                </div>

                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Timeline</span>
                  <p style={styles.detailVal}>{project.year}</p>
                </div>

                <div style={styles.detailCard}>
                  <span style={styles.detailLabel}>Core Deliverables</span>
                  <p style={styles.detailVal}>
                    {project.video_url ? 'Motion Design, Video Production, Editing' : 'Brand System, Visual Direction'}
                  </p>
                </div>
              </div>

              {/* Narrative Content */}
              <div style={styles.narrativeSection}>
                <h2 style={styles.sectionHeading}>Design Overview & Strategy</h2>
                <p style={styles.paragraph}>
                  {project.challenge ||
                    'This project embodies a strategic approach to visual identity and motion design, focusing on clarity, timing, and restrained aesthetic principles. Every detail was crafted to maintain brand integrity across digital platforms.'}
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
    backgroundColor: 'var(--bg-canvas, #0d0d0d)',
    color: 'var(--text-charcoal, #f0f0f0)',
    fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
  },
  mainContent: {
    padding: '40px 24px 100px 24px',
  },
  container: {
    maxWidth: '920px',
    margin: '0 auto',
  },
  topNav: {
    marginBottom: '32px',
  },
  backBtn: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: '12px',
    color: 'var(--text-muted, #888)',
    textDecoration: 'none',
    letterSpacing: '0.05em',
    transition: 'color 0.2s ease',
  },
  loadingBox: {
    padding: '80px 0',
    textAlign: 'center',
    fontFamily: "var(--font-mono, monospace)",
    color: 'var(--text-muted, #888)',
  },
  errorBox: {
    padding: '80px 0',
    textAlign: 'center',
  },
  homeLink: {
    color: 'var(--accent-bronze, #d4af37)',
    fontSize: '14px',
    marginTop: '16px',
    display: 'inline-block',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: '11px',
    color: 'var(--accent-bronze, #d4af37)',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    padding: '5px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  yearText: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: '12px',
    color: 'var(--text-muted, #888)',
  },
  title: {
    fontFamily: "var(--font-serif, Georgia, serif)",
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: '400',
    lineHeight: '1.15',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  summary: {
    fontSize: '17px',
    lineHeight: '1.7',
    color: 'var(--text-muted, #aaa)',
    maxWidth: '680px',
  },
  /* Editorial Cinema Framing */
  heroStage: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
  },
  coverFrame: {
    width: '100%',
    maxWidth: '800px',
    aspectRatio: '16 / 9',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  coverVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#000',
    display: 'block',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    padding: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  detailCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailLabel: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: '10px',
    color: 'var(--text-muted, #777)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  detailVal: {
    fontSize: '14px',
    color: 'var(--text-charcoal, #eee)',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  narrativeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '12px',
  },
  sectionHeading: {
    fontFamily: "var(--font-serif, Georgia, serif)",
    fontSize: '28px',
    fontWeight: '400',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'var(--text-muted, #aaa)',
  },
  bottomNav: {
    paddingTop: '40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center',
  },
  primaryBackBtn: {
    padding: '14px 28px',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },
};