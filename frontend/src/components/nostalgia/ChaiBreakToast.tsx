import { useEffect, useState } from 'react';
import { useNostalgia } from '@/hooks/useNostalgia';
import Toast from '@/components/common/Toast';

/** Tier-4 easter egg: after 60s of idle time on the game table, nudge for a chai break. */
export default function ChaiBreakToast() {
  const { easterEggs } = useNostalgia();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!easterEggs) return;
    let idleTimer: number;
    const resetIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setMessage('Chai leke aata hoon ☕'), 60000);
    };
    resetIdle();
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, [easterEggs]);

  return <Toast message={message} onDismiss={() => setMessage(null)} />;
}
