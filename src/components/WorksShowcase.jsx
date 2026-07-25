import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const CACHE_KEY = 'swr_cached_projects';

export default function WorksShowcase() {
  // Stale-While-Revalidate (SWR): Load cached projects instantly from localStorage
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => projects.length === 0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setProjects(response.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
      }
    } catch (err) {
      console.warn('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const displayedProjects = filteredProjects.slice(0, 4);

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="works" style={styles.section}>
      <div style={styles.container}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={styles.headerRow}
        >
          <div>
            <span style={styles.monoCategory}>Selected Work</span>
            <h2 style={styles.sectionTitle}>Featured Projects</h2>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div style={styles.tabContainer} className="scrollable-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.tabBtn,
                    ...(selectedCategory === cat ? styles.activeTabBtn : {}),
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {loading && projects.length === 0 ? (
          /* High-End Shimmer Skeleton Grid */
          <div style={styles.grid}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={styles.skeletonCard} className="shimmer-card">
                <div style={styles.skeletonImage} />
                <div style={styles.skeletonBody}>
                  <div style={styles.skeletonMeta} />
                  <div style={styles.skeletonTitle} />
                  <div style={styles.skeletonSub} />
                </div>
              </div>
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <div style={styles.emptyBox}>No projects found in this collection.</div>
        ) : (
          <motion.div
            style={styles.grid}
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {displayedProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => navigate(`/work/${proj.id}`)}
                style={{
                  ...styles.card,
                  gridColumn: idx % 5 === 0 && !isMobileWidth() ? 'span 2' : 'span 1',
                }}
                className="editorial-card"
              >
                <div style={styles.imageBox}>
                  {proj.cover_image_url ? (
                    <motion.img
                      src={proj.cover_image_url}
                      alt={proj.title}
                      style={styles.cardImg}
                      variants={{
                        hover: { scale: 1.06, transition: { duration: 0.4, ease: 'easeOut' } },
                      }}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      <span style={styles.placeholderTag}>{proj.category || 'Design'}</span>
                    </div>
                  )}
                  <div style={styles.imageBadgeOverlay}>
                    <span style={styles.categoryBadge}>{proj.category || 'Editorial'}</span>
                  </div>
                  <motion.div
                    style={styles.hoverOverlay}
                    variants={{
                      hover: { opacity: 1, y: 0 },
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    View Project Case &rarr;
                  </motion.div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardMeta}>
                    <span style={styles.clientText}>{proj.client || 'Commission'}</span>
                    <span style={styles.yearText}>{proj.year}</span>
                  </div>

                  <h3 style={styles.cardTitle}>{proj.title}</h3>
                  <p style={styles.cardSummary}>{proj.summary}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Explore Full Archive Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={styles.viewAllRow}
        >
          <motion.button
            whileHover={{ scale: 1.04, translateY: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/projects')}
            style={styles.viewAllBtn}
            className="btn-responsive"
          >
            Explore Full Project Archive ({projects.length}) &rarr;
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

const isMobileWidth = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const styles = {
  section: {
    padding: '64px 20px',
    backgroundColor: 'var(--bg-canvas)',
    borderBottom: '1px solid var(--border-hairline)',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '36px',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '16px',
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
    fontSize: 'clamp(32px, 5vw, 44px)',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    gap: '6px',
    backgroundColor: 'var(--bg-surface)',
    padding: '4px',
    borderRadius: '6px',
    border: '1px solid var(--border-hairline)',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  tabBtn: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    color: 'var(--text-muted)',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  activeTabBtn: {
    backgroundColor: 'var(--accent-bronze)',
    color: 'var(--accent-contrast)',
    fontWeight: '500',
  },
  emptyBox: {
    padding: '36px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    justifyItems: 'center',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '14px',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow: 'var(--card-shadow)',
    width: '100%',
  },
  imageBox: {
    height: '270px',
    backgroundColor: 'var(--badge-bg)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageBadgeOverlay: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    zIndex: 2,
  },
  hoverOverlay: {
    position: 'absolute',
    bottom: '14px',
    right: '14px',
    backgroundColor: 'var(--text-charcoal)',
    color: 'var(--bg-canvas)',
    padding: '7px 16px',
    borderRadius: '20px',
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.04em',
    zIndex: 2,
  },
  imagePlaceholder: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-hairline)',
  },
  placeholderTag: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '6px 14px',
    border: '1px solid var(--border-hairline)',
    borderRadius: '20px',
  },
  cardBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  categoryBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--text-charcoal)',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  clientText: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--accent-bronze)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  yearText: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: '24px',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 8px 0',
  },
  cardSummary: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  viewAllRow: {
    marginTop: '36px',
    textAlign: 'center',
  },
  viewAllBtn: {
    padding: '12px 28px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-charcoal)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  skeletonCard: {
    width: '100%',
    height: '380px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    opacity: 0.6,
  },
  skeletonImage: {
    height: '240px',
    backgroundColor: 'var(--border-hairline)',
  },
  skeletonBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skeletonMeta: {
    width: '40%',
    height: '14px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
  skeletonTitle: {
    width: '80%',
    height: '22px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
  skeletonSub: {
    width: '60%',
    height: '14px',
    backgroundColor: 'var(--border-hairline)',
    borderRadius: '4px',
  },
};
