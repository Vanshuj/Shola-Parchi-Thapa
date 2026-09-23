import { useEffect, useRef, useState } from 'react';
const EMOJI_CATEGORIES = [
    {
        category: 'Royalty & Parchis',
        emojis: ['👑', '🫅', '👸', '🃏', '🎴', '🎯', '⚡', '💥', '🖐️', '✋', '🏆', '🥇'],
    },
    {
        category: 'Heritage & Baithak',
        emojis: ['🪔', '☕', '🍵', '🪷', '🦚', '🐅', '🐘', '📜', '🖋️', '🔔', '✨', '🌟'],
    },
    {
        category: 'Fun & Expressions',
        emojis: ['😊', '😂', '🤣', '😎', '🤫', '😱', '🥳', '😈', '🤠', '🤩', '🔥', '💖'],
    },
    {
        category: 'Chai & Snacks',
        emojis: ['🥟', '🌶️', '🥭', '🍬', '🥤', '🍿', '🎲', '🎭', '🎪', '🪄', '💎', '⭐'],
    },
];
export default function EmojiPickerWrapper({ onSelect, isOpen, onToggle, onClose, }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = typeof isOpen === 'boolean';
    const open = isControlled ? isOpen : internalOpen;
    const handleToggle = onToggle || (() => setInternalOpen((o) => !o));
    const handleClose = onClose || (() => setInternalOpen(false));
    const containerRef = useRef(null);
    // Auto-close when clicking outside
    useEffect(() => {
        if (!open)
            return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                handleClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);
    return (<div ref={containerRef} className="relative">
      <button type="button" onClick={handleToggle} className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-all duration-200 select-none ${open
            ? 'border-primary bg-primary/10 shadow-sm scale-105'
            : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container hover:border-secondary-container'}`} aria-label="Pick an emoji" title="Choose an emoji for this chit">
        😊
      </button>

      {open && (<div className="absolute right-0 bottom-full mb-2 z-50 w-72 sm:w-80 rounded-2xl border border-outline-variant/80 bg-surface-container-lowest/95 backdrop-blur-xl p-3.5 shadow-2xl animate-fade-in" style={{ minWidth: '280px' }}>
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-outline-variant/40">
            <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-on-surface flex items-center gap-1.5">
              <span>✨</span> Select Chit Emoji
            </span>
            <button type="button" onClick={handleClose} className="flex h-6 w-6 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-sm transition-colors" aria-label="Close emoji picker">
              ✕
            </button>
          </div>

          {/* Emoji Lists by Category */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {EMOJI_CATEGORIES.map((cat) => (<div key={cat.category}>
                <div className="text-[10px] font-label-sm uppercase tracking-wider text-secondary font-bold mb-1 pl-1">
                  {cat.category}
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {cat.emojis.map((emoji) => (<button key={emoji} type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-xl hover:bg-surface-container hover:scale-125 active:scale-95 transition-all select-none" onClick={() => {
                        onSelect(emoji);
                        handleClose();
                    }} title={emoji}>
                      {emoji}
                    </button>))}
                </div>
              </div>))}
          </div>
        </div>)}
    </div>);
}
