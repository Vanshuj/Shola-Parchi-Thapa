import { useEffect, useState } from 'react';
/** Ticking countdown (seconds remaining) toward an ISO turnDeadline, clamped at 0. */
export function useTurnTimer(turnDeadline) {
    const [secondsLeft, setSecondsLeft] = useState(() => computeRemaining(turnDeadline));
    useEffect(() => {
        setSecondsLeft(computeRemaining(turnDeadline));
        if (!turnDeadline)
            return;
        const interval = setInterval(() => setSecondsLeft(computeRemaining(turnDeadline)), 250);
        return () => clearInterval(interval);
    }, [turnDeadline]);
    return secondsLeft;
}
function computeRemaining(turnDeadline) {
    if (!turnDeadline)
        return 0;
    const diffMs = new Date(turnDeadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / 1000));
}
