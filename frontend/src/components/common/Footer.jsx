import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-low px-6 py-6 text-body-sm text-on-surface-variant transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-hand text-xl text-primary font-bold">Play the classic, together.</p>
          <p className="text-xs text-secondary mt-0.5">
            Solah Parchi Thap — a digital revival of the traditional Indian verandah card game.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-secondary">
          <Link to="/rules" className="hover:text-primary transition-colors">
            Game Rules
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/customize" className="hover:text-primary transition-colors">
            Customize Parchis
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/leaderboard" className="hover:text-primary transition-colors">
            Leaderboard
          </Link>
          <span className="opacity-40">•</span>
          <Link to="/feedback" className="inline-flex items-center gap-1 text-primary hover:underline font-semibold">
            <Icon name="mark_email_read" size={14} />
            <span>Feedback</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
