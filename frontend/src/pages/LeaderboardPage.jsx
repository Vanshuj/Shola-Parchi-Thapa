import { useEffect, useState } from 'react';
import { leaderboardApi } from '@/api/leaderboardApi';
import { formatWinRate } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/common/Icon';
import Loader from '@/components/common/Loader';
const PODIUM_STYLE = [
    { label: 'Current Verandah Emperor', rankLabel: '#1 Gold', bg: 'bg-secondary-container/30 border-secondary-container', badge: 'bg-secondary-container text-on-secondary-container' },
    { label: 'Rank #2 • Silver Kumkum', rankLabel: '#2 Silver', bg: 'bg-surface-container-low border-outline-variant', badge: 'bg-surface-container-highest text-on-surface' },
    { label: 'Rank #3 • Bronze Neel', rankLabel: '#3 Bronze', bg: 'bg-surface-container-low border-outline-variant', badge: 'bg-tertiary-container text-on-tertiary' },
];
export default function LeaderboardPage() {
    const { username } = useAuth();
    const [entries, setEntries] = useState(null);
    useEffect(() => {
        leaderboardApi.get(100).then(setEntries);
    }, []);
    if (!entries)
        return <Loader />;
    const podium = entries.slice(0, 3);
    const rest = entries.slice(3);
    const totalGames = entries.reduce((sum, e) => sum + e.wins + e.losses, 0);
    return (<div className="max-w-6xl mx-auto px-space-md lg:px-margin py-space-xl">
      <div className="rounded-xl bg-secondary-container/20 px-space-md py-space-sm mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
        <span className="flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"/> Season 4: Holiday Verandah Edition
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">Ledger Register #S4-2024</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-lg">
        <div>
          <span className="flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold mb-1">
            <Icon name="military_tech" size={16}/> Hall of Fame &amp; Royal Bahi-Khata
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
            Baithak Champions &amp; Legends <span className="italic text-secondary font-title-lg">(Hall of Verandah)</span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Global Elo standings, quickest Thap reflex logs, and lifetime scores recorded on the ancestral verandah floor.
          </p>
        </div>
        <div className="flex gap-space-lg rounded-xl bg-surface-container-low px-space-lg py-space-sm shrink-0">
          <div>
            <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">Total players</span>
            <span className="block font-headline-sm text-headline-sm text-primary">{entries.length}</span>
          </div>
          <div>
            <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">Games logged</span>
            <span className="block font-headline-sm text-headline-sm text-secondary">{totalGames}</span>
          </div>
        </div>
      </div>

      {/* Podium */}
      {podium.length > 0 && (<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-xl">
          {podium.map((entry, i) => (<div key={entry.rank} className={`rounded-xl border p-space-lg ${PODIUM_STYLE[i].bg} ${i === 0 ? 'sm:order-2 sm:-translate-y-3' : i === 1 ? 'sm:order-1' : 'sm:order-3'}`}>
              <span className={`inline-block px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold mb-space-sm ${PODIUM_STYLE[i].badge}`}>
                {PODIUM_STYLE[i].rankLabel}
              </span>
              <div className="flex items-center gap-space-sm mb-space-md">
                <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">{entry.username}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Rank #{entry.rank}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-space-sm text-center">
                <div>
                  <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">Elo</span>
                  <span className="block font-headline-sm text-headline-sm text-primary">{entry.eloRating}</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">Wins</span>
                  <span className="block font-headline-sm text-headline-sm text-on-surface">{entry.wins}</span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm uppercase text-on-surface-variant">Win %</span>
                  <span className="block font-headline-sm text-headline-sm text-on-surface">{formatWinRate(entry.wins, entry.losses)}</span>
                </div>
              </div>
            </div>))}
        </div>)}

      {/* Standings table */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="px-space-lg py-space-md flex items-center justify-between border-b border-outline-variant">
          <h2 className="font-title-lg text-title-lg text-on-surface">Universal Standings</h2>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Season 4</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant font-label-sm text-label-sm uppercase text-on-surface-variant">
                <th className="py-space-sm px-space-lg">Rank</th>
                <th className="px-space-sm">Player</th>
                <th className="px-space-sm">Elo Rating</th>
                <th className="px-space-sm">Games / Win %</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => {
            const isYou = entry.username === username;
            return (<tr key={entry.rank} className={`border-b border-outline-variant/50 ${isYou ? 'bg-secondary-container/10' : ''}`}>
                    <td className="py-space-sm px-space-lg font-mono text-on-surface-variant">#{entry.rank}</td>
                    <td className="px-space-sm font-label-md text-label-md font-bold text-on-surface">
                      {entry.username} {isYou && <span className="text-secondary">(You)</span>}
                    </td>
                    <td className="px-space-sm font-mono text-primary font-bold">{entry.eloRating}</td>
                    <td className="px-space-sm font-body-sm text-body-sm text-on-surface-variant">
                      {entry.wins + entry.losses} games &bull; {formatWinRate(entry.wins, entry.losses)} win rate
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
