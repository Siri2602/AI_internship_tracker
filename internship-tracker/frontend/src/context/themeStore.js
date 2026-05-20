import { create } from 'zustand';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create((set, get) => {
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
      set({ theme });
    },
    toggleTheme: () => {
      const { theme } = get();
      const next = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
      set({ theme: next });
    },
    isDark: () => {
      const { theme } = get();
      return theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');
    },
  };
});
