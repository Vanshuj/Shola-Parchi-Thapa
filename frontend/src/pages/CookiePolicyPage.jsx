import { Link } from 'react-router-dom';
import Icon from '@/components/common/Icon';

const COOKIE_CATEGORIES = [
  {
    icon: 'lock',
    title: '1. Strictly Necessary & Session Storage',
    badge: 'Mandatory / Always Active',
    badgeClass: 'bg-primary/10 text-primary',
    summary: 'These items are required to establish your encrypted player session, protect room integrity, authenticate WebSocket actions, and store your cookie choices.',
    items: [
      {
        key: 'spt_token',
        type: 'Local Storage / Header',
        duration: '24 Hours (Session Lifespan)',
        purpose: 'Stores the cryptographically signed JWT bearer token issued upon login/guest session creation.',
      },
      {
        key: 'spt_user_id & spt_username',
        type: 'Local Storage',
        duration: 'Persistent until logout',
        purpose: 'Maintains active player identity, display name, and seat assignment in multiplayer rooms.',
      },
      {
        key: 'spt_cookie_consent',
        type: 'Local Storage',
        duration: '1 Year or until cache clear',
        purpose: 'Records your affirmative cookie and data preferences in compliance with the DPDP Act 2023.',
      },
    ],
  },
  {
    icon: 'tune',
    title: '2. Functional & Baithak Experience Storage',
    badge: 'Optional / Customizable',
    badgeClass: 'bg-secondary/15 text-secondary',
    summary: 'These items store your sensory preferences to make each visit feel like your familiar courtyard baithak.',
    items: [
      {
        key: 'theme',
        type: 'Local Storage',
        duration: 'Persistent',
        purpose: 'Remembers whether you prefer Dopahar (Light) or Raat (Dark) Baithak visual theme.',
      },
      {
        key: 'spt_preferences',
        type: 'Local Storage',
        duration: 'Persistent',
        purpose: 'Preserves audio master volume, sound effect volume, selected classical ambient raga, and chosen avatar.',
      },
      {
        key: 'spt_custom_parchis',
        type: 'Local Storage',
        duration: 'Persistent on Device',
        purpose: 'Saves your custom handwritten chit labels (e.g., family nicknames, local foods) exclusively on your local device. These are never broadcast over the network.',
      },
    ],
  },
  {
    icon: 'visibility_off',
    title: '3. Analytics, Tracking & Advertising Pixels',
    badge: 'Zero Tracking Policy',
    badgeClass: 'bg-green-600/10 text-green-700 dark:text-green-400',
    summary: 'Solah Parchi Thap is strictly built as a cultural parlor recreation. We respect your dignity and peace of mind.',
    items: [
      {
        key: 'No Third-Party Ad Networks',
        type: 'None',
        duration: 'N/A',
        purpose: 'We do not run Google AdSense, Meta Pixel, Hotjar, TikTok Pixel, or any third-party behavioral trackers.',
      },
      {
        key: 'No Surveillance Tracking',
        type: 'None',
        duration: 'N/A',
        purpose: 'We do not sell, rent, or trade your gameplay patterns, IP address, or device fingerprints to data brokers.',
      },
    ],
  },
  {
    icon: 'integration_instructions',
    title: '4. Third-Party Embeds (External Services)',
    badge: 'User-Consented Only',
    badgeClass: 'bg-secondary-container/40 text-secondary',
    summary: 'When you choose to open external forms or services, third parties may drop their own cookies.',
    items: [
      {
        key: 'Google Forms (Feedback)',
        type: 'Third-Party Embed',
        duration: 'Subject to Google Policy',
        purpose: 'Our primary feedback form is 100% native and first-party. If you explicitly choose to load the external Google Form embed, Google LLC may place functional cookies (e.g. NID, SID). We require your explicit opt-in before loading this embed.',
      },
      {
        key: 'Google Fonts CDN',
        type: 'Font Asset CDN',
        duration: 'Session Cache',
        purpose: 'Web fonts (Epilogue, Literata, Space Grotesk, Kalam) are loaded via Google Fonts CDN for authentic typography. No cookies are sent with font requests.',
      },
    ],
  },
];

export default function CookiePolicyPage() {
  function handleOpenPreferences() {
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  }

  return (
    <div className="max-w-4xl mx-auto px-space-md lg:px-margin py-space-xl">
      {/* Header Card */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-space-lg mb-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="px-space-sm py-0.5 rounded-md bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Cookies &amp; Local Storage
            </span>
            <span className="px-space-sm py-0.5 rounded-md bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              India DPDP Act 2023 Compliant
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs">
            Cookies &amp; Storage Policy
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Solah Parchi Thap is committed to complete transparency regarding the cookies, web storage, and local tokens we utilize to power your nostalgic multiplayer gaming experience.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleOpenPreferences}
            className="inline-flex items-center gap-space-xs rounded-lg bg-secondary-container px-space-md py-space-sm font-label-md text-label-md font-bold text-on-secondary-container hover:brightness-95 transition-all shadow-sm"
          >
            <Icon name="tune" size={18} />
            <span>Manage Preferences</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-space-xs rounded-lg border border-outline px-space-md py-space-sm font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <Icon name="arrow_back" size={18} />
            <span>Back to Game</span>
          </Link>
        </div>
      </div>

      {/* Overview Box */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-space-lg mb-space-xl text-left">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 flex items-center gap-2">
          <Icon name="info" size={22} className="text-secondary" />
          <span>Understanding Web Storage &amp; Cookies</span>
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-3">
          Cookies and HTML5 Local Storage are small pieces of structured data stored securely inside your browser by websites you visit. They enable websites to remember who you are during an active session, preserve your visual and sound preferences, and keep multiplayer connections secure.
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Under India&rsquo;s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and global privacy standards, we collect only strictly necessary data, do not engage in behavioral surveillance, and provide you with instant, unconditional controls to configure or withdraw consent at any time.
        </p>
      </div>

      {/* Categories Accordions / Cards */}
      <div className="space-y-space-lg mb-space-xl">
        {COOKIE_CATEGORIES.map((cat) => (
          <article
            key={cat.title}
            className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg shadow-sm text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={cat.icon} size={22} />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {cat.title}
                </h3>
              </div>
              <span className={`px-space-sm py-1 rounded-full text-xs font-bold self-start sm:self-auto ${cat.badgeClass}`}>
                {cat.badge}
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
              {cat.summary}
            </p>

            <div className="overflow-x-auto rounded-lg border border-outline-variant/40">
              <table className="w-full text-left text-body-sm">
                <thead className="bg-surface-container-low text-on-surface font-label-md">
                  <tr>
                    <th className="px-space-md py-space-xs font-bold">Key / Identifier</th>
                    <th className="px-space-md py-space-xs font-bold">Storage Type</th>
                    <th className="px-space-md py-space-xs font-bold">Duration</th>
                    <th className="px-space-md py-space-xs font-bold">Functional Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-on-surface-variant font-body-sm">
                  {cat.items.map((item) => (
                    <tr key={item.key} className="hover:bg-surface-container-high/40">
                      <td className="px-space-md py-space-sm font-mono text-xs font-bold text-on-surface">
                        {item.key}
                      </td>
                      <td className="px-space-md py-space-sm">{item.type}</td>
                      <td className="px-space-md py-space-sm">{item.duration}</td>
                      <td className="px-space-md py-space-sm">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>

      {/* How to Control Cookies */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg mb-space-xl text-left">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm flex items-center gap-2">
          <Icon name="settings_suggest" size={22} className="text-secondary" />
          <span>How to Control &amp; Withdraw Your Consent</span>
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
          You can exercise full control over how cookies and local storage tokens are processed on your device:
        </p>
        <ul className="list-disc list-inside space-y-2 font-body-md text-body-md text-on-surface-variant mb-space-lg">
          <li>
            <strong>Interactive In-App Manager:</strong> Click the <button type="button" onClick={handleOpenPreferences} className="text-primary font-bold underline">Manage Preferences</button> button at any time to modify or revoke functional and third-party storage permissions.
          </li>
          <li>
            <strong>Browser Settings:</strong> You can configure your browser (Chrome, Firefox, Safari, Edge) to block cookies, delete storage on browser exit, or notify you whenever a cookie is set.
          </li>
          <li>
            <strong>Cache &amp; Storage Clearing:</strong> In our <Link to="/settings" className="text-primary font-bold underline">Account Settings</Link>, click &ldquo;Clear Local Cache&rdquo; to instantaneously erase all non-essential audio and game state cache.
          </li>
        </ul>

        <div className="p-space-md rounded-xl bg-surface-container-low border-l-4 border-secondary">
          <p className="font-body-sm text-body-sm text-secondary font-medium">
            <strong>Note on Essential Storage:</strong> Disabling strictly necessary storage (such as the authentication JWT token) will prevent the application from maintaining your active multiplayer session and room seat.
          </p>
        </div>
      </div>

      {/* Business Details & Grievance Officer */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant/50 p-space-lg text-left">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="verified_user" size={22} className="text-secondary" />
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Data Protection &amp; Grievance Redressal
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
          Under Section 8(10) &amp; Section 13 of the Digital Personal Data Protection Act, 2023, if you have any questions, grievances, or requests regarding this Cookies Policy or your personal data rights, please contact our designated Grievance Redressal Officer:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md text-body-sm">
          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block mb-1">
              Data Fiduciary &amp; Business Entity
            </span>
            <p className="font-bold text-on-surface">Solah Parchi Thap Interactive Games</p>
            <p className="text-on-surface-variant">Heritage Courtyard, C-Scheme, Jaipur, Rajasthan 302001, India</p>
            <p className="text-on-surface-variant mt-1">Email: <a href="mailto:support@solahparchithap.in" className="text-primary hover:underline">support@solahparchithap.in</a></p>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40">
            <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block mb-1">
              Grievance Redressal Officer (DPDP Act)
            </span>
            <p className="font-bold text-on-surface">Vanshika Jain</p>
            <p className="text-on-surface-variant">Designation: Data Protection &amp; Grievance Officer</p>
            <p className="text-on-surface-variant">Email: <a href="mailto:grievance@solahparchithap.in" className="text-primary hover:underline">grievance@solahparchithap.in</a></p>
            <p className="text-[11px] text-secondary font-semibold mt-1">Statutory Response Window: Within 30 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
