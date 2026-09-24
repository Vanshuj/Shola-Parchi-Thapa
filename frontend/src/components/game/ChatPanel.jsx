import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePreferenceStore } from '@/store/preferenceStore';
import Icon from '@/components/common/Icon';
import { useSound } from '@/hooks/useSound';

const QUICK_TAUNTS = [
  { icon: 'emoji_food_beverage', label: 'Chai break!' },
  { icon: 'bolt', label: 'THAP ready!' },
  { icon: 'bolt', label: 'Hurry up and pass!' },
  { icon: 'auto_awesome', label: 'Brilliant!' },
];

export default function ChatPanel({ messages, onSend }) {
  const [draft, setDraft] = useState('');
  const username = useAuthStore((s) => s.username);
  const emoteWheel = usePreferenceStore((s) => s.preferences.emoteWheel ?? true);
  const { playChat, playChai, playThap } = useSound();

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    playChat();
    onSend(draft.trim());
    setDraft('');
  }

  function handleTaunt(label) {
    if (label.includes('Chai')) {
      playChai();
    } else if (label.includes('THAP')) {
      playThap();
    } else {
      playChat();
    }
    onSend(label);
  }

  return (
    <div className="flex h-[32rem] w-full lg:w-80 flex-col rounded-xl bg-surface-container-low shadow-sm shrink-0">
      <div className="flex items-center justify-between px-space-md py-space-sm border-b border-outline-variant">
        <span className="flex items-center gap-space-xs font-headline-sm text-headline-sm text-on-surface">
          <Icon name="chat" size={20} className="text-primary" /> Baithak Logs
        </span>
      </div>

      {emoteWheel && (
        <div className="px-space-md py-space-sm border-b border-outline-variant">
          <span className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-xs">
            Quick taunts &amp; shouts
          </span>
          <div className="flex flex-wrap gap-space-xs">
            {QUICK_TAUNTS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => handleTaunt(t.label)}
                className="flex items-center gap-1 rounded-full bg-surface-container-highest px-space-sm py-1 font-label-sm text-label-sm text-on-surface hover:bg-secondary-container/40 transition-all active:scale-95 cursor-pointer"
              >
                <Icon name={t.icon} size={14} className="text-secondary" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 space-y-space-sm overflow-y-auto px-space-md py-space-sm">
        {messages.map((m, i) => {
          const isYou = m.from === username;
          return (
            <div key={i} className={isYou ? 'text-right' : 'text-left'}>
              <span
                className={`block font-label-sm text-label-sm font-bold mb-0.5 ${
                  isYou ? 'text-primary' : 'text-secondary'
                }`}
              >
                {isYou ? 'You' : m.from}
              </span>
              <p
                className={`inline-block rounded-xl px-space-sm py-space-xs font-body-md text-body-md max-w-[85%] ${
                  isYou
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface shadow-sm'
                }`}
              >
                {m.text}
              </p>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-lg">
            No messages yet. Say hi to the baithak!
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-space-xs border-t border-outline-variant p-space-sm"
      >
        <input
          aria-label="Chat message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message or taunt…"
          maxLength={280}
          className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm py-2 font-body-md text-body-md outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 hover:bg-primary-container transition-all active:scale-95"
        >
          <Icon name="send" size={18} />
        </button>
      </form>
    </div>
  );
}
