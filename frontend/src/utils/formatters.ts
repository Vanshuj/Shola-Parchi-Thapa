export function formatRoomCode(code: string): string {
  return code.toUpperCase();
}

export function formatElo(elo: number): string {
  return elo.toLocaleString();
}

export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '—';
  return `${Math.round((wins / total) * 100)}%`;
}

export function formatSecondsClock(seconds: number): string {
  return `0:${seconds.toString().padStart(2, '0')}`;
}
