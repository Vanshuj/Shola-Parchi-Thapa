import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoomStore } from '@/store/roomStore';
import { usePreferenceStore } from '@/store/preferenceStore';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import SangeetPlayerButton from './SangeetPlayerButton';
const NAV_LINKS = [
    { path: 'home', label: 'Home', to: '/' },
    { path: 'lobby', label: 'Lobby', to: '/lobby' },
    { path: 'customize-parchis', label: 'Customize Parchis', to: '/customize' },
    { path: 'leaderboard', label: 'Leaderboard', to: '/leaderboard' },
    { path: 'rules', label: 'Rules', to: '/rules' },
];
export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const room = useRoomStore((s) => s.room);
    const playerAvatar = usePreferenceStore((s) => s.preferences.playerAvatar ?? 'raja');
    const avatarIconMap = {
      raja: 'crown',
      dadi: 'elderly_woman',
      chacha: 'face',
      chhotu: 'bolt',
      chai: 'emoji_food_beverage',
    };
    const currentAvatarIcon = avatarIconMap[playerAvatar] || 'person';
    return (<header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface-container-low/95 dark:bg-surface-container-low/90 dark:border-b dark:border-outline-variant/30 shadow-[0_4px_16px_rgba(46,21,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300">
      <div className="flex h-20 w-full items-center justify-between gap-space-md px-space-md lg:px-margin">
        <div className="flex items-center gap-space-lg">
          <Link to="/" className="flex items-center gap-space-sm" aria-label="Solah Parchi Thap Home">
            <img
              src="/spt-emblem.png"
              alt="Solah Parchi Thap Traditional Heritage Emblem (© 2026 Solah Parchi Thap Interactive Games)"
              title="© 2026 Solah Parchi Thap Interactive Games. All rights reserved."
              className="h-10 w-10 object-contain drop-shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm uppercase leading-tight tracking-tight text-primary">
                SOLAH PARCHI THAP
              </span>
              <span className="font-body-sm text-body-sm italic leading-none text-secondary">
                Play the classic, together
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-space-xs xl:flex">
            {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to ||
                (link.path === 'lobby' &&
                    (location.pathname.startsWith('/lobby') || location.pathname === '/dashboard'));
            return (<Link key={link.path} to={link.to} className={active
                    ? 'rounded-lg bg-primary-container px-space-md py-space-sm font-bold text-on-primary shadow-sm transition-colors'
                    : 'rounded-lg px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface'}>
                  {link.label}
                </Link>);
        })}
          </nav>
        </div>

        <div className="flex items-center gap-space-sm lg:gap-space-md">
          {room && (<Link to={`/lobby/${room.roomCode}`} className="hidden items-center gap-space-xs rounded-lg bg-surface-container-highest px-space-sm py-space-xs sm:flex hover:bg-surface-container-high transition-colors">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container"/>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
                Room
              </span>
              <span className="font-label-md text-label-md font-mono tracking-widest text-on-surface">
                #{room.roomCode}
              </span>
            </Link>)}

          <SangeetPlayerButton />

          <ThemeToggle />

          {isAuthenticated ? (<>
              <Link to="/settings" title="Settings &amp; Baithak Preferences" aria-label="Settings &amp; Baithak Preferences" className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Icon name="settings" size={20}/>
              </Link>
              <div className="flex items-center gap-space-sm pl-space-xs">
                <div className="hidden flex-col text-right md:flex">
                  <span className="font-label-md text-label-md font-bold leading-tight text-on-surface">
                    {username}
                  </span>
                  <div className="flex items-center justify-end gap-space-xs">
                    <span className="font-label-sm text-label-sm font-bold text-secondary">ELO</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-container"/>
                  </div>
                </div>
                <button type="button" onClick={() => {
                logout();
                navigate('/');
            }} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Log out of Solah Parchi Thap" aria-label="Log out of Solah Parchi Thap">
                  <Icon name={currentAvatarIcon} size={18}/>
                </button>
              </div>
            </>) : (<>
              <Link to="/login" className="rounded-lg px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Log in
              </Link>
              <Link to="/signup" className="rounded-lg bg-primary px-space-md py-space-sm font-label-lg text-label-lg font-bold text-on-primary shadow-sm hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Sign up
              </Link>
            </>)}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/60 bg-surface-container text-on-surface xl:hidden hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-outline-variant/60 bg-surface-container-lowest/98 px-space-md py-space-md shadow-xl xl:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-space-md py-2.5 font-label-md text-label-md font-bold transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cookies"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-space-md py-2 text-xs font-semibold text-secondary hover:bg-surface-container-high transition-colors mt-2 border-t border-outline-variant/30 pt-3"
            >
              Cookies Policy &amp; Storage Preferences
            </Link>
          </nav>
        </div>
      )}
    </header>);
}
