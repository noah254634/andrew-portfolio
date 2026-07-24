import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicNavbar from './components/PublicNavbar';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import ServicesPage from './pages/ServicesPage';
import { useThemeStore } from './store/useThemeStore';

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <PublicNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:id" element={<ProjectDetail />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-canvas)',
    color: 'var(--text-charcoal)',
  },
};
