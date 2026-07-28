import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { formatImageUrl } from '../api/axios';

const CACHE_KEY = 'swr_cached_projects';

export default function ProjectsPage() {
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
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
      console.warn('Failed to load project catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isVideo = (url, contentType) => {
    if (contentType && contentType.startsWith('video/')) return true;
    if (url && /\.(mp4|webm|mov|m4v|ogv)$/i.test(url)) return true;
    return false;
  };

  const renderCardThumbnail = (proj) => {
    // Motion reel takes priority over static cover
    if (proj.video_url) {
      return (
        <video
          src={formatImageUrl(proj.video_url)}
          poster={proj.cover_image_url ? formatImageUrl(proj.cover_image_url) : undefined}
          muted
          loop
          playsInline
          preload="metadata"
          style={styles.cardImg}
        />
      );
    }
    if (proj.cover_image_url) {
      const url = formatImageUrl(proj.cover_image_url);
      // Fallback: cover might still be a video if stored in cover_image_url
      if (isVideo(url, proj.cover_content_type)) {
        return (
          <video
            src={url}
            muted
            loop
            playsInline
            preload="metadata"
            style={styles.cardImg}
          />
        );
      }
      return (
        <motion.img
          src={url}
          alt={proj.title}
          style={styles.cardImg}
          variants={{
            hover: { scale: 1.06, transition: { duration: 0.4, ease: 'easeOut' } },
          }}
        />
      );
    }
    return (
      <div style={styles.imagePlaceholder}>
        <span style={styles.placeholderTag}>{proj.category || 'Design'}</span>
      </div>
    );
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <main style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header Breadcrumb & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={styles.headerBox}
        >
          <span style={styles.monoCategory}>Full Portfolio Archive</span>
          <h1 style={styles.pageTitle}>Selected Works & Commissions</h1>
          <p style={styles.subtitleText}>
            A comprehensive archive of brand identities, publications, packaging, and digital visual systems crafted for design-forward clients worldwide.
          </p>
        </motion.div>

        {/* Filter Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={styles.filterBar}
        >
          {/* Search Box */}
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search projects, clients, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
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

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={styles.skeletonCard}>
                <div style={styles.skeletonImage} />
                <div style={styles.skeletonBody}>
                  <div style={styles.skeletonMeta} />
                  <div style={styles.skeletonTitle} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={styles.emptyBox}>No projects match your search or filter selection.</div>
        ) : (
          <motion.div
            style={styles.grid}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => navigate(`/work/${proj.id}`)}
                style={styles.card}
                className="editorial-card"
              >
                <div style={styles.imageBox}>
                  {renderCardThumbnail(proj)}
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
                    View Case &rarr;
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
      </div>
    </main>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    padding: '48px 20px 80px 20px',
    backgroundColor: 'var(--bg-canvas)',
    color: 'var(--text-charcoal)',
    fontFamily: "var(--font-sans)",
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  headerBox: {
    marginBottom: '40px',
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
    marginBottom: '8px',
  },
  pageTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 12px 0',
  },
  subtitleText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    maxWidth: '640px',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '36px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '8px',
    padding: '8px 14px',
    minWidth: '280px',
    flex: '0 1 360px',
  },
  searchIcon: {
    fontSize: '14px',
    opacity: 0.6,
  },
  searchInput: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-charcoal)',
    fontSize: '13px',
    outline: 'none',
  },
  tabContainer: {
    display: 'flex',
    gap: '6px',
    backgroundColor: 'var(--bg-surface)',
    padding: '4px',
    borderRadius: '8px',
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
    padding: '48px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
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
    boxShadow: 'var(--card-shadow)',
    width: '100%',
  },
  imageBox: {
    height: '260px',
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
  skeletonCard: {
    width: '100%',
    height: '360px',
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
};
