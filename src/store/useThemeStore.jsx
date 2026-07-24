import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('portfolio_theme') || 'light',

  initTheme: () => {
    const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    set({ theme: savedTheme });
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('portfolio_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return { theme: nextTheme };
    });
  },
}));
