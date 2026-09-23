import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import Icon from './Icon';
export default function ThemeToggle({ className = '' }) {
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    const isDark = theme === 'dark';
    return (<button type="button" onClick={toggleTheme} aria-label={isDark ? 'Switch to Dopahar (Light) mode' : 'Switch to Raat (Dark) mode'} title={isDark ? 'Switch to Dopahar (Light) mode' : 'Switch to Raat (Dark) mode'} className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 border border-outline-variant/60 bg-surface-container/70 hover:bg-surface-container-high text-on-surface shadow-sm hover:shadow-md hover:border-secondary-container/80 ${isDark ? 'glow-gold' : ''} ${className}`}>
      <motion.div key={theme} initial={{ rotate: -90, scale: 0.6, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0.6, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="flex items-center justify-center text-secondary-container">
        <Icon name={isDark ? 'dark_mode' : 'light_mode'} size={20}/>
      </motion.div>
    </button>);
}
