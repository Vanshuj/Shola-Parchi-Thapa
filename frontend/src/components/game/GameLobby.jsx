import { useState } from 'react';
import Icon from '@/components/common/Icon';
const SEAT_COLORS = ['bg-primary text-on-primary', 'bg-secondary-container text-on-secondary-container', 'bg-tertiary-container text-on-tertiary', 'bg-primary-fixed-dim text-on-primary-fixed'];
export default function GameLobby({ room, isHost, onStart, onLeave }) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const canStart = room.seatedUsernames.length >= 2;
    const emptySeats = Math.max(0, room.maxPlayers - room.seatedUsernames.length);
    function handleCopyCode() {
        navigator.clipboard.writeText(room.roomCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    }
    function handleCopyLink() {
        const inviteUrl = `${window.location.origin}/lobby/${room.roomCode}`;
        navigator.clipboard.writeText(inviteUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    }
    return (<div className="max-w-5xl mx-auto">
      {/* Room setup bar */}
      <div className="rounded-t-xl border-t-4 border-primary bg-surface-container-low px-space-lg py-space-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-sm sm:gap-space-md">
          <span className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"/>
            Active Baithak
          </span>
          <div className="flex items-center gap-1 bg-surface-container-lowest px-space-sm py-1 rounded-lg border border-outline-variant">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Code:</span>
            <strong className="font-mono text-title-sm tracking-widest text-primary font-bold px-1">{room.roomCode}</strong>
            <button type="button" onClick={handleCopyCode} title="Copy room code" className="p-1 rounded hover:bg-surface-container text-secondary transition-colors">
              <Icon name={copiedCode ? "check" : "content_copy"} size={16}/>
            </button>
            {copiedCode && <span className="text-[11px] text-secondary font-bold">Copied!</span>}
          </div>
          <button type="button" onClick={handleCopyLink} className="px-space-sm py-1 rounded-full bg-surface-container-highest hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors">
            <Icon name={copiedLink ? "check" : "share"} size={14} className="text-secondary"/>
            {copiedLink ? 'Link Copied!' : 'Share Link'}
          </button>
          <span className="px-space-sm py-1 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
            <Icon name={room.private ? "lock" : "public"} size={14}/> {room.private ? 'Private Baithak' : 'Public Baithak'}
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
          {room.seatedUsernames.length}/{room.maxPlayers} players seated
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest px-space-lg py-space-xl rounded-b-xl shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mb-space-xl">
          {room.seatedUsernames.map((name, i) => (<div key={name} className="rounded-xl bg-surface-container p-space-md flex flex-col items-center gap-space-xs text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-title-md ${SEAT_COLORS[i % SEAT_COLORS.length]}`}>
                {name.charAt(0).toUpperCase()}
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {name}
                {i === 0 && ' (Host)'}
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
                Seated
              </span>
            </div>))}
          {Array.from({ length: emptySeats }).map((_, i) => (<div key={`empty-${i}`} className="rounded-xl border-2 border-dashed border-outline-variant p-space-md flex flex-col items-center justify-center gap-space-xs text-center text-on-surface-variant">
              <Icon name="person_add" size={28}/>
              <span className="font-label-sm text-label-sm">Seat {room.seatedUsernames.length + i + 1} (Open)</span>
              <span className="font-body-sm text-body-sm">Awaiting player&hellip;</span>
            </div>))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg border-t border-outline-variant">
          <button type="button" onClick={onLeave} className="px-space-lg py-space-sm rounded-lg bg-surface-container text-on-surface-variant font-label-lg text-label-lg font-bold hover:bg-surface-container-high transition-colors">
            Leave Baithak
          </button>
          {isHost ? (<button type="button" onClick={onStart} disabled={!canStart} className="px-space-xl py-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-space-xs">
              <Icon name="front_hand" size={20}/> Start Baithak
            </button>) : (<span className="font-body-md text-body-md text-on-surface-variant">Waiting for host to start&hellip;</span>)}
        </div>
        {isHost && !canStart && (<p className="mt-space-sm text-center font-body-sm text-body-sm text-on-surface-variant">
            Need at least 2 players seated to start.
          </p>)}
      </div>
    </div>);
}
