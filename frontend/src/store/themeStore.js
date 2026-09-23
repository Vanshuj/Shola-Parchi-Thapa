import { create } from 'zustand';
function getInitialTheme() {
    if (typeof window === 'undefined')
        return 'light';
    const saved = localStorage.getItem('spt-theme');
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}
function applyTheme(theme) {
    if (typeof document === 'undefined')
        return;
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
        root.classList.add('dark');
        body?.classList.add('dark');
        root.style.colorScheme = 'dark';
    }
    else {
        root.classList.remove('dark');
        body?.classList.remove('dark');
        root.style.colorScheme = 'light';
    }
    try {
        localStorage.setItem('spt-theme', theme);
    }
    catch {
        // ignore
    }
}
// Apply theme immediately upon module load to prevent flash of wrong theme
if (typeof window !== 'undefined') {
    applyTheme(getInitialTheme());
}
export const useThemeStore = create((set) => ({
    theme: getInitialTheme(),
    toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        return { theme: nextTheme };
    }),
    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },
}));
