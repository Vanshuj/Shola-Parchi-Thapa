import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('spt-theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  if (theme === 'dark') {
    root.classList.add('dark');
    body?.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    body?.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  try {
    localStorage.setItem('spt-theme', theme);
  } catch {
    // ignore
  }
}

// Apply theme immediately upon module load to prevent flash of wrong theme
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const nextTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      return { theme: nextTheme };
    }),
  setTheme: (theme: ThemeMode) => {
    applyTheme(theme);
    set({ theme });
  },
}));
