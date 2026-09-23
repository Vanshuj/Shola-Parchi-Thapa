import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
export default function Toast({ message, onDismiss, durationMs = 4000 }) {
    useEffect(() => {
        if (!message)
            return;
        const timer = setTimeout(onDismiss, durationMs);
        return () => clearTimeout(timer);
    }, [message, onDismiss, durationMs]);
    return (<AnimatePresence>
      {message && (<motion.div className="fixed bottom-space-lg left-1/2 z-50 -translate-x-1/2 rounded-full bg-inverse-surface text-inverse-on-surface px-space-lg py-space-sm font-label-md text-label-md shadow-xl flex items-center gap-space-xs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} role="status">
          <Icon name="check_circle" size={18}/>
          {message}
        </motion.div>)}
    </AnimatePresence>);
}
