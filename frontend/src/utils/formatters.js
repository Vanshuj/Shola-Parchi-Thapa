export function formatRoomCode(code) {
    return code.toUpperCase();
}
export function formatElo(elo) {
    return elo.toLocaleString();
}
export function formatWinRate(wins, losses) {
    const total = wins + losses;
    if (total === 0)
        return '—';
    return `${Math.round((wins / total) * 100)}%`;
}
export function formatSecondsClock(seconds) {
    return `0:${seconds.toString().padStart(2, '0')}`;
}
