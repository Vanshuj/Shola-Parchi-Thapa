import { useEffect, useState } from 'react';
export function useReducedMotion() {
    const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listener = (e) => setReduced(e.matches);
        mql.addEventListener('change', listener);
        return () => mql.removeEventListener('change', listener);
    }, []);
    return reduced;
}
