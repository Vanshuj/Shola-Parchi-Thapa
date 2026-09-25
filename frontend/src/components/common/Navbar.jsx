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
    { path: 'feedback', label: 'Feedback', to: '/feedback' },
];
export default function Navbar() {
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
          <Link to="/" className="flex items-center gap-space-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-[0_2px_4px_rgba(133,83,0,0.2)]">
              <Icon name="filter_vintage" size={24}/>
            </div>
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
              <Link to="/settings" title="Settings &amp; Baithak Preferences" className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
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
            }} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary" title="Log out">
                  <Icon name={currentAvatarIcon} size={18}/>
                </button>
              </div>
            </>) : (<>
              <Link to="/login" className="rounded-lg px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface">
                Log in
              </Link>
              <Link to="/signup" className="rounded-lg bg-primary px-space-md py-space-sm font-label-lg text-label-lg font-bold text-on-primary shadow-sm hover:bg-primary-container">
                Sign up
              </Link>
            </>)}
        </div>
      </div>
    </header>);
}
