import { useState } from 'react';
import api from '../api/axios';

export default function InquiryForm() {
  const [selectedScopes, setSelectedScopes] = useState(['Brand Identity']);
  const [selectedTimeline, setSelectedTimeline] = useState('1 - 2 Months');
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const scopeOptions = [
    'Brand Identity & Strategy',
    'Editorial Design & Print',
    'Digital Visual Systems',
    'Creative Direction',
  ];

  const timelineOptions = ['Immediate (< 1 Mo)', '1 - 2 Months', 'Flexible / Q2+'];

  const toggleScope = (scope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const formattedMessage = `
[Project Brief Inquiry]
Selected Scopes: ${selectedScopes.join(', ') || 'Not specified'}
Estimated Timeline: ${selectedTimeline}

Message Overview:
${formData.message}
    `.trim();

    try {
      await api.post('/inquiries', {
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        message: formattedMessage,
      });
      setSuccessMessage('✓ Project inquiry transmitted. Andrew will review your brief & get in touch shortly!');
      setFormData({ sender_name: '', sender_email: '', message: '' });
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.card} className="inquiry-card">
          <div style={styles.header}>
            <span style={styles.monoCategory}>Initiate Collaboration</span>
            <h2 style={styles.sectionTitle}>Project Brief & Estimator</h2>
            <p style={styles.subtitle}>
              Select your required project scope & timeline to request a customized design proposal.
            </p>
          </div>

          {successMessage && <div style={styles.successBanner}>{successMessage}</div>}
          {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Interactive Scope Selection */}
            <div style={styles.pickerGroup}>
              <label style={styles.label}>1. Select Project Scope(s)</label>
              <div style={styles.pillGrid}>
                {scopeOptions.map((scope) => {
                  const active = selectedScopes.includes(scope);
                  return (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => toggleScope(scope)}
                      style={{
                        ...styles.pillBtn,
                        ...(active ? styles.activePillBtn : {}),
                      }}
                    >
                      {active ? '✓ ' : '+ '}
                      {scope}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Estimator */}
            <div style={styles.pickerGroup}>
              <label style={styles.label}>2. Expected Schedule / Timeline</label>
              <div style={styles.pillGrid}>
                {timelineOptions.map((timeline) => {
                  const active = selectedTimeline === timeline;
                  return (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => setSelectedTimeline(timeline)}
                      style={{
                        ...styles.pillBtn,
                        ...(active ? styles.activePillBtn : {}),
                      }}
                    >
                      {active ? '● ' : '○ '}
                      {timeline}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div style={styles.rowTwo}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>3. Your Name</label>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  required
                  placeholder="e.g. Sarah Jenkins"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>4. Email Address</label>
                <input
                  type="email"
                  value={formData.sender_email}
                  onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                  required
                  placeholder="sarah@brand.com"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>5. Brief Description & Objectives</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                placeholder="Describe your brand vision, key deliverables, and design goals..."
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={submitting} style={styles.submitBtn} className="btn-responsive">
              {submitting ? 'Transmitting Brief...' : 'Transmit Project Brief &rarr;'}
            </button>
          </form>
        </div>
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
    maxWidth: '840px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '16px',
    padding: '36px 24px',
    boxShadow: 'var(--card-shadow)',
  },
  header: {
    marginBottom: '28px',
    textAlign: 'center',
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
  sectionTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: '400',
    color: 'var(--text-charcoal)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    maxWidth: '540px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  pickerGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pillGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pillBtn: {
    padding: '8px 12px',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '6px',
    color: 'var(--text-charcoal)',
    fontSize: '12px',
    fontFamily: "var(--font-mono)",
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  activePillBtn: {
    backgroundColor: 'var(--accent-bronze)',
    color: 'var(--accent-contrast)',
    borderColor: 'var(--accent-bronze)',
    fontWeight: '500',
  },
  rowTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--text-charcoal)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 14px',
    backgroundColor: 'var(--bg-canvas)',
    border: '1px solid var(--border-hairline)',
    borderRadius: '6px',
    color: 'var(--text-charcoal)',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: 'var(--text-charcoal)',
    color: 'var(--bg-canvas)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.03em',
    cursor: 'pointer',
    marginTop: '8px',
    width: '100%',
  },
  successBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(185, 28, 28, 0.1)',
    border: '1px solid rgba(185, 28, 28, 0.3)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};
