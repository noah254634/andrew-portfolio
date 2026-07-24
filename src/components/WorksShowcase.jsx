import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function WorksShowcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (Array.isArray(response.data)) {
        setProjects(response.data);
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

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);

  return (
    <section id="works" style={styles.section}>
      <div style={styles.container}>
        {/* Section Header */}
        <div style={styles.headerRow}>
          <div>
            <span style={styles.monoCategory}>Selected Work</span>
            <h2 style={styles.sectionTitle}>Projects</h2>
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
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading project catalogue...</div>
        ) : displayedProjects.length === 0 ? (
          <div style={styles.emptyBox}>No projects found in this collection.</div>
        ) : (
          <div style={styles.grid}>
            {displayedProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/work/${proj.id}`)}
                style={styles.card}
                className="editorial-card"
              >
                <div style={styles.imageBox}>
                  {proj.cover_image_url ? (
                    <img src={proj.cover_image_url} alt={proj.title} style={styles.cardImg} />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      <span>{proj.category || 'Design'}</span>
                    </div>
                  )}
                  <span style={styles.hoverOverlay}>View Project &rarr;</span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardMeta}>
                    <span style={styles.categoryBadge}>{proj.category || 'Editorial'}</span>
                    <span style={styles.yearText}>{proj.year}</span>
                  </div>

                  <h3 style={styles.cardTitle}>{proj.title}</h3>
                  <p style={styles.cardSummary}>{proj.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Projects Button */}
        {filteredProjects.length > 4 && !showAll && (
          <div style={styles.viewAllRow}>
            <button onClick={() => setShowAll(true)} style={styles.viewAllBtn} className="btn-responsive">
              View All Projects &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

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
  loadingBox: {
    padding: '40px',
    textAlign: 'center',
    fontFamily: "var(--font-mono)",
    color: 'var(--text-muted)',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease',
  },
  imageBox: {
    height: '240px',
    backgroundColor: 'var(--bg-canvas)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  hoverOverlay: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'var(--text-charcoal)',
    color: 'var(--bg-canvas)',
    padding: '5px 12px',
    borderRadius: '20px',
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    opacity: 0.9,
  },
  imagePlaceholder: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  categoryBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: '10px',
    color: 'var(--accent-bronze)',
    backgroundColor: 'var(--badge-bg)',
    padding: '3px 8px',
    borderRadius: '3px',
    textTransform: 'uppercase',
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
};
