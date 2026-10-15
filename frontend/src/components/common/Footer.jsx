import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Footer() {
  function handleOpenCookiePreferences() {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  }

  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-low px-4 sm:px-6 py-8 text-body-sm text-on-surface-variant transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Top row: Brand & Quick links */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-outline-variant/40">
          <div className="text-center md:text-left flex items-center md:items-start gap-3">
            <img
              src="/spt-emblem.png"
              alt="Solah Parchi Thap Traditional Heritage Game Emblem (© 2026 Solah Parchi Thap Interactive Games)"
              title="© 2026 Solah Parchi Thap Interactive Games. All rights reserved."
              className="h-10 w-10 object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <p className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
                SOLAH PARCHI THAP
              </p>
              <p className="text-xs text-secondary mt-0.5 font-medium">
                Traditional Indian Verandah Game Revival &bull; 100% Free &bull; Non-Gambling Cultural Parlor Experience
              </p>
            </div>
          </div>

          <nav aria-label="Legal and information navigation" className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-xs font-semibold text-secondary">
            <Link to="/rules" className="hover:text-primary transition-colors">
              Game Rules
            </Link>
            <span className="opacity-40" aria-hidden="true">•</span>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy (DPDP Act)
            </Link>
            <span className="opacity-40" aria-hidden="true">•</span>
            <Link to="/cookies" className="hover:text-primary transition-colors">
              Cookies Policy
            </Link>
            <span className="opacity-40" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="hover:text-primary transition-colors underline cursor-pointer"
              aria-label="Open cookie preferences modal"
            >
              Cookie Preferences
            </button>
            <span className="opacity-40" aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="opacity-40" aria-hidden="true">•</span>
            <Link to="/feedback" className="inline-flex items-center gap-1 text-primary hover:underline font-bold">
              <Icon name="mark_email_read" size={14} />
              <span>Feedback &amp; Grievance</span>
            </Link>
          </nav>
        </div>

        {/* Middle row: Business Details & DPDP Grievance Officer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-on-surface-variant">
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
            <span className="font-label-sm uppercase tracking-wider text-secondary font-bold block mb-1">
              Business Entity Details
            </span>
            <p className="font-semibold text-on-surface">Solah Parchi Thap Interactive Games</p>
            <p className="mt-0.5 text-on-surface-variant">Heritage Courtyard, C-Scheme, Jaipur, Rajasthan 302001 &amp; Indiranagar, Bengaluru 560038, India</p>
            <p className="mt-1">Inquiries: <a href="mailto:support@solahparchithap.in" className="text-primary hover:underline">support@solahparchithap.in</a></p>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
            <span className="font-label-sm uppercase tracking-wider text-secondary font-bold block mb-1">
              Grievance Redressal (DPDP Act 2023)
            </span>
            <p className="font-semibold text-on-surface">Vanshika Jain, Data Protection Officer</p>
            <p className="mt-0.5 text-on-surface-variant">Appointed under Section 8(10) of the DPDP Act, 2023</p>
            <p className="mt-1">Email: <a href="mailto:grievance@solahparchithap.in" className="text-primary hover:underline">grievance@solahparchithap.in</a></p>
            <p className="text-[11px] text-secondary font-medium mt-0.5">Turnaround: Acknowledgement &lt; 48h, Resolution &lt; 30d</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
            <span className="font-label-sm uppercase tracking-wider text-secondary font-bold block mb-1">
              Copyright on Images &amp; Assets
            </span>
            <p className="font-semibold text-on-surface">© 2026 Solah Parchi Thap Interactive Games.</p>
            <p className="mt-0.5 text-on-surface-variant">
              All visual emblems, card illustrations, chit textures, 3D Baithak models, and audio compositions are proprietary copyrighted works.
            </p>
          </div>
        </div>

        {/* Bottom row: Final copyright disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant/80 border-t border-outline-variant/30 pt-4">
          <p>© 2026 Solah Parchi Thap Interactive Games. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Skill-based cultural folk recreation &bull; No real money, wagering, or gambling involved.
          </p>
        </div>
      </div>
    </footer>
  );
}
